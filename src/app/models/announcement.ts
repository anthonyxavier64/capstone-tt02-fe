import { AnnouncementType } from "../models/announcement-type";

export class Announcement {
  announcementId: number | undefined;
  title: string | undefined;
  description: string | undefined;
  date: Date | undefined;
  announcementType: AnnouncementType | undefined;

  constructor(
    id?: number,
    title?: string,
    description?: string,
    announcementType?: AnnouncementType
  ) {
    this.announcementId = id;
    this.title = title;
    this.description = description;
    this.announcementType = announcementType;
  }
}
