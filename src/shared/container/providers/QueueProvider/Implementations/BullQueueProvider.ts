import { emailQueue } from "../../../../../job/queue";
import { IQueueProvider } from "../IQueueProvider";

export class BullQueueProvider implements IQueueProvider {
  async add(jobName: string, data: any): Promise<void> {
    await emailQueue.add(jobName, data);
  }
}
