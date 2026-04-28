import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

interface PublicationAuthor {
	id: number;
	nombre: string;
	foto: string | null;
}

interface PublicationFeedItem {
	id_publicacion: number;
	contenido_texto: string;
	imagen_url: string | null;
	fecha_publicacion: string;
	autor: PublicationAuthor;
}

@Component({
	selector: 'app-see-publications',
	standalone: false,
	templateUrl: './see-publications.html',
	styleUrl: './see-publications.scss',
})
export class SeePublications implements OnInit {
	private readonly apiBaseUrl = 'http://localhost:3000';

	publications: PublicationFeedItem[] = [];
	isLoading = false;
	isLoadingMore = false;
	errorMessage = '';
	
	private currentPage = 1;
	private itemsPerPage = 10;
	private hasMorePublications = true;
	private isScrolling = false;

	constructor(
		private readonly http: HttpClient,
		private readonly router: Router,
		private readonly translate: TranslateService,
		private readonly cdr: ChangeDetectorRef,
	) {}

	ngOnInit(): void {
		this.loadPublications();
	}

	@HostListener('window:scroll')
	onWindowScroll(): void {
		if (this.isScrolling || this.isLoadingMore || !this.hasMorePublications) {
			return;
		}

		const scrollPosition = window.scrollY + window.innerHeight;
		const threshold = document.documentElement.scrollHeight - 500;

		if (scrollPosition >= threshold) {
			this.isScrolling = true;
			setTimeout(() => {
				this.loadMorePublications();
				this.isScrolling = false;
			}, 300);
		}
	}

	get hasPublications(): boolean {
		return this.publications.length > 0;
	}

	getAuthorPhoto(publication: PublicationFeedItem): string {
		return publication.autor.foto || '';
	}

	getPublicationImage(publication: PublicationFeedItem): string {
		return publication.imagen_url || '';
	}

	getAuthorInitials(publication: PublicationFeedItem): string {
		return this.buildInitials(publication.autor.nombre);
	}

	onCreatePublication(): void {
		this.router.navigate(['/worker/publications/create-publication']);
	}

	private loadPublications(): void {
		const token = localStorage.getItem('access_token');

		if (!token) {
			this.errorMessage = this.t('publications.see.errors.noSession');
			return;
		}

		this.isLoading = true;
		this.errorMessage = '';
		this.publications = [];
		this.currentPage = 1;
		this.hasMorePublications = true;

		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

		this.http.get<PublicationFeedItem[]>(`${this.apiBaseUrl}/publications/feed`, { headers }).subscribe({
			next: (response) => {
				this.publications = Array.isArray(response) ? response : [];

				if (this.publications.length === 0) {
					this.errorMessage = this.t('publications.see.errors.empty');
				} else if (this.publications.length < this.itemsPerPage) {
					this.hasMorePublications = false;
				}

				this.isLoading = false;
				this.cdr.detectChanges();
			},
			error: (error) => {
				console.error('Error al cargar publicaciones:', error);
				this.errorMessage = this.t('publications.see.errors.loadFailed');
				this.isLoading = false;
				this.cdr.detectChanges();
			}
		});
	}

	private loadMorePublications(): void {
		if (!this.hasMorePublications || this.isLoadingMore) {
			return;
		}

		const token = localStorage.getItem('access_token');
		if (!token) {
			return;
		}

		this.isLoadingMore = true;
		this.currentPage += 1;

		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

		this.http.get<PublicationFeedItem[]>(`${this.apiBaseUrl}/publications/feed`, { headers }).subscribe({
			next: (response) => {
				const newPublications = Array.isArray(response) ? response : [];

				if (newPublications.length > 0) {
					this.publications = [...this.publications, ...newPublications];
				}

				if (newPublications.length < this.itemsPerPage) {
					this.hasMorePublications = false;
				}

				this.isLoadingMore = false;
				this.cdr.detectChanges();
			},
			error: (error) => {
				console.error('Error al cargar más publicaciones:', error);
				this.isLoadingMore = false;
				this.cdr.detectChanges();
			}
		});
	}

	private buildInitials(name: string | null | undefined): string {
		const normalized = (name || '').trim();

		if (!normalized) {
			return 'DC';
		}

		return normalized
			.split(/\s+/)
			.slice(0, 2)
			.map((part) => part.charAt(0).toUpperCase())
			.join('');
	}

	private t(key: string): string {
		return this.translate.instant(key);
	}
}
