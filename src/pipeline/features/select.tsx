import { IPipelineMiddleware } from '@/pipeline/types';
import { validatePrimaryKey } from '@/pipeline/utils';
import React from 'react';

interface IUseSelectPipelineOption {
  selectedKeys?: string[];
  onSelect?: (selected: boolean, key: string, row: any) => any;
  toggleCheckAll?: (selected: boolean, keys: string[]) => any;
}

export default function useSelectPipeline(option?: IUseSelectPipelineOption): IPipelineMiddleware {
  const {
    selectedKeys,
    onSelect,
    toggleCheckAll
  } = option || {};


  return pipeline => {
    try {
      validatePrimaryKey(pipeline, '使用useSelectPipeline必须设置rowKey！');

      const Checkbox: any = pipeline.getContext().components.Checkbox;

      if (!Checkbox) {
        console.warn('使用useSelectPipeline前请确保 context.components.Checkbox 存在');
        throw null;
      }

      const columns = [...pipeline.getColumns()];
      const dataSource = [...pipeline.getDataSource()];

      let indeterminate = false
      const allChecked = dataSource.every((r, i) => {
        const k = pipeline.getPrimaryKey()(r, i)
        const exist = selectedKeys.includes(k)
        if (exist) {
          indeterminate = true;
        }
        return exist;
      })

      indeterminate = !allChecked && indeterminate

      columns.unshift({
        title: (
          <Checkbox
            checked={allChecked}
            indeterminate={indeterminate}
            onChange={e => {
              const keys = e.target.checked ? dataSource.map((r, i) => {
                return pipeline.getPrimaryKey()(r, i);
              }) : []
              if (toggleCheckAll) {
                toggleCheckAll(e.target.checked, keys)
              }
            }}
          />
        ),
        code: 'select',
        width: 50,
        render: (value, record, index) => {
          const key = pipeline.getPrimaryKey()(record, index);
          const checked = (selectedKeys || []).includes(key);
          return (
            <Checkbox
              checked={checked}
              onChange={e => {
                if (onSelect) {
                  onSelect(e.target.checked, key, record);
                }
              }}
            />
          );
        }
      });

      pipeline.columns(columns);
    } catch (e) {
    }
    return pipeline;
  };
}
