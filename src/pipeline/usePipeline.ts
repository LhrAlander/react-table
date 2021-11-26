import { useRef, useState } from 'react';
import PipelineManager from '@/pipeline/pipelineManager'

export function usePipeline(context?: any) {
  const [state, setState] = useState<any>({})
  const instance = useRef<PipelineManager>(new PipelineManager(state, setState, context))
  return instance.current
}
