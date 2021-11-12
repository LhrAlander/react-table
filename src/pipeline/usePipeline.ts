import { useState } from 'react'
import PipelineManager from '@/pipeline/pipelineManager'

export function usePipeline() {
  const [state, setState] = useState<any>({})
  return new PipelineManager(state, setState)
}
