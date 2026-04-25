import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

interface UploadResponse {
	url: string;
}

interface CreatePublicationRequest {
	contenido_texto: string;
	imagen_url?: string;
}

@Component({
	selector: 'app-create-publications',
	standalone: false,
	templateUrl: './create-publications.html',
	styleUrl: './create-publications.scss',
})
export class CreatePublications {
	private readonly apiBaseUrl = 'http://localhost:3000';
	private readonly allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
	private readonly maxFileSizeBytes = 2 * 1024 * 1024;

	readonly maxDescriptionLength = 500;

	description = '';
	selectedImage: File | null = null;
	imagePreviewUrl: string | null = null;

	isSubmitting = false;
	feedbackMessage = '';
	feedbackType: 'success' | 'error' = 'success';

	constructor(
		private readonly http: HttpClient,
		private readonly router: Router,
		private readonly translate: TranslateService,
	) {}

	get charCount(): number {
		return this.description.length;
	}

	onDescriptionInput(event: Event): void {
		const target = event.target as HTMLTextAreaElement;
		this.description = target.value;
	}

	onImageSelected(event: Event): void {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (!file) {
			return;
		}

		if (!this.allowedTypes.includes(file.type)) {
			this.showFeedback(this.t('publications.create.messages.invalidImageType'), 'error');
			input.value = '';
			return;
		}

		if (file.size > this.maxFileSizeBytes) {
			this.showFeedback(this.t('publications.create.messages.imageTooLarge'), 'error');
			input.value = '';
			return;
		}

		this.selectedImage = file;
		this.revokePreviewUrl();
		this.imagePreviewUrl = URL.createObjectURL(file);
		this.feedbackMessage = '';
	}

	removeImage(event?: Event): void {
		event?.preventDefault();
		this.selectedImage = null;
		this.revokePreviewUrl();

		const input = document.getElementById('inputImagen') as HTMLInputElement | null;
		if (input) {
			input.value = '';
		}
	}

	async onSubmit(event: Event): Promise<void> {
		event.preventDefault();

		if (this.isSubmitting) {
			return;
		}

		const token = localStorage.getItem('access_token');
		if (!token) {
			this.showFeedback(this.t('publications.create.messages.noSession'), 'error');
			return;
		}

		const contenidoTexto = this.description.trim();
		if (!contenidoTexto) {
			this.showFeedback(this.t('publications.create.messages.descriptionRequired'), 'error');
			return;
		}

		this.isSubmitting = true;
		this.feedbackMessage = '';

		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

		try {
			let uploadedImageUrl: string | undefined;

			if (this.selectedImage) {
				const formData = new FormData();
				formData.append('file', this.selectedImage);

				const uploadResponse = await firstValueFrom(
					this.http.post<UploadResponse>(`${this.apiBaseUrl}/upload`, formData, { headers }),
				);

				uploadedImageUrl = uploadResponse.url;
			}

			const body: CreatePublicationRequest = {
				contenido_texto: contenidoTexto,
				...(uploadedImageUrl ? { imagen_url: uploadedImageUrl } : {}),
			};

			await firstValueFrom(
				this.http.post(`${this.apiBaseUrl}/publications/posts`, body, { headers }),
			);

			this.resetForm();
			this.showFeedback(this.t('publications.create.messages.createSuccess'), 'success');
			this.router.navigate(['/publications']);
		} catch (error: any) {
			const backendMessage = error?.error?.message;
			const readableMessage = Array.isArray(backendMessage)
				? backendMessage.join(' ')
				: backendMessage;

			if (
				typeof readableMessage === 'string' &&
				readableMessage.toLowerCase().includes('subir imagen')
			) {
				this.showFeedback(this.t('publications.create.messages.uploadFailed'), 'error');
			} else {
				this.showFeedback(
					readableMessage || this.t('publications.create.messages.createFailed'),
					'error',
				);
			}
		} finally {
			this.isSubmitting = false;
		}
	}

	resetForm(): void {
		this.description = '';
		this.removeImage();
		this.feedbackMessage = '';
	}

	private revokePreviewUrl(): void {
		if (this.imagePreviewUrl) {
			URL.revokeObjectURL(this.imagePreviewUrl);
			this.imagePreviewUrl = null;
		}
	}

	private showFeedback(message: string, type: 'success' | 'error'): void {
		this.feedbackMessage = message;
		this.feedbackType = type;
	}

	private t(key: string): string {
		return this.translate.instant(key);
	}
}
