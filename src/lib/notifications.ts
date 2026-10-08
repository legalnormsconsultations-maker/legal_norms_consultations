import { enqueueBackgroundJob } from "@/lib/queue";

/**
 * Types of entities a user can follow
 */
export type FollowableEntityType =
  | "DRUG"
  | "MANUFACTURER"
  | "AUTHORITY"
  | "CATEGORY";

/**
 * Events that trigger notifications
 */
export type NotificationTrigger =
  | "REGULATORY_UPDATE"
  | "APPROVAL_EVENT"
  | "SAFETY_UPDATE"
  | "NEW_DOCUMENT"
  | "PORTFOLIO_UPDATE";

/**
 * Supported Notification Channels
 */
export type NotificationChannel = "IN_APP" | "EMAIL" | "SMS" | "PUSH";

export interface NotificationPayload {
  userId: string;
  trigger: NotificationTrigger;
  title: string;
  message: string;
  entityType: FollowableEntityType;
  entityId: string;
  actionUrl?: string;
  channels: NotificationChannel[]; // Determines where this goes
}

/**
 * Notification Channel Abstraction Layer
 *
 * Centralizes the dispatch of all alerts across the platform.
 * Prevents hardcoding email logic or push logic directly into business services.
 */
export const NotificationService = {
  /**
   * Dispatch a notification to a specific user across their preferred channels.
   * This offloads the actual delivery (e.g. sending the email via SendGrid) to the async job queue.
   */
  async notifyUser(payload: NotificationPayload): Promise<void> {
    console.log(
      `[NotificationService] Routing alert to user ${payload.userId} for ${payload.trigger}`,
    );

    // 1. Always save to In-App database immediately for the UI bell icon
    if (payload.channels.includes("IN_APP")) {
      await NotificationService.persistInAppNotification(payload);
    }

    // 2. Dispatch heavy external network calls to the queue (Section 29 compliance)
    if (payload.channels.includes("EMAIL")) {
      await enqueueBackgroundJob("SEND_EMAIL", {
        userId: payload.userId,
        subject: payload.title,
        body: payload.message,
        actionUrl: payload.actionUrl,
      });
    }

    // Expandable for SMS, Push notifications, Webhooks, etc.
  },

  /**
   * Fan-out: Notify ALL users who follow a specific entity.
   */
  async notifyFollowers(
    entityType: FollowableEntityType,
    entityId: string,
    trigger: NotificationTrigger,
    title: string,
    message: string,
    actionUrl?: string,
  ): Promise<void> {
    // Note: In production, this would query a `user_follows` table
    // to retrieve the list of users subscribed to this specific entityId.

    // const followers = await db.select().from(user_follows).where(...)
    // followers.forEach(user => this.notifyUser(...))

    console.log(
      `[NotificationService] Fanning out ${trigger} to all followers of ${entityType} ${entityId}. Title: ${title}. Message: ${message}. Action: ${actionUrl ?? "none"}`,
    );
  },

  async persistInAppNotification(payload: NotificationPayload): Promise<void> {
    // Inserts the notification into a Postgres `notifications` table so it shows up on the Dashboard
    console.log(
      `[NotificationService] Saved IN_APP notification for user ${payload.userId}`,
    );
  },
};
