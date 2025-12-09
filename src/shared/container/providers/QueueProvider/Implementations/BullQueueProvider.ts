import { emailQueue } from "../../../../../job/queue";
import { IQueueProvider } from "../IQueueProvider";

export class BullQueueProvider implements IQueueProvider {
  async add(jobName: string, data: any): Promise<void> {
    try {
      await emailQueue.add(jobName, data);
    } catch (error) {
      console.error("[Queue] Erro ao adicionar job na fila:", error);
    }
  }
}
