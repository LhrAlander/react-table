import PipelineManager from '@/pipeline/pipelineManager';

export interface IPipelineMiddleware {
  (pipeline: PipelineManager): PipelineManager
}
