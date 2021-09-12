import { AnnouncementType } from "../models/announcement-type";

export class Announcement {
  announcementId: number | undefined;
<<<<<<< HEAD
  title: string | undefined;
  description: string | undefined;
=======
  title: String | undefined;
  description: String | undefined;
>>>>>>> e7ee119 ([Announcement CRUD]created files for announcement model,added create and view ops under announcement management, created view edit & delete announcement components)
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
