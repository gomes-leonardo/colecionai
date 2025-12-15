import { auctionQueue, emailQueue } from "../../../../../jobs/queue";
import { IQueueProvider } from "../IQueueProvider";

export class BullQueueProvider implements IQueueProvider {
  async add(jobName: string, data: any): Promise<void> {
    if (jobName === "forgot-password" || jobName === "register-confirmation") {
      await emailQueue.add(jobName, data);
    }
    await auctionQueue.add(jobName, data);
  }
}
