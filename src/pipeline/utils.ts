import PipelineManager from '@/pipeline/pipelineManager';

export function validatePrimaryKey(pipeline: PipelineManager, friendlyMsg?: string) {
  if (pipeline.getPrimaryKey()) {
    return;
  }

  console.warn(friendlyMsg || '在使用pipeline插件前请确保调用 setPrimaryKey 方法!')
  throw null
}
