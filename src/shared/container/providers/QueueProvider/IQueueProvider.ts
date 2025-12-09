export interface IQueueProvider {
  add(jobName: string, data: any): Promise<void>;
}
