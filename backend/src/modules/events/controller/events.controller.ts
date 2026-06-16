import { Controller, Post, Get, Body } from '@nestjs/common';
import { EventsService } from '../service/events.service';
import { CreateEventDto } from '../dto/create-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async createEvent(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.createEvent(createEventDto);
  }

  @Get()
  async getActiveEvents() {
    return this.eventsService.getActiveEvents();
  }
}
