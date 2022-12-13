import React, { useState } from 'react'
import * as antd from 'antd'
import BaseTable from '@/table/baseTable'
import { IColumn } from '@/table/table.type'
import { usePipeline } from '@/pipeline/usePipeline'
import useSelectPipeline from '@/pipeline/features/select'

function getDataSource() {
  const dataSource = []
  const dataLength = 100
  for (let i = 0; i < dataLength; i++) {
    dataSource.push({
      id: i,
      name: 'Alander',
      age: 23,
      job: `Programmer${i}`,
      address: '中国，浙江省，杭州市，滨江区，海量大厦15楼',
      hobby: 'Game',
      desc: '这个人很懒，没有留下任何介绍',
    })
  }
  return dataSource
}

const columns: IColumn[] = [
  {
    code: 'id',
    title: '#',
    width: 60,
  },
  {
    code: 'name',
    title: '姓名',
    width: 90,
  },
  {
    code: 'age',
    title: '年龄',
    width: 170,
  },
  {
    code: 'job',
    title: '职业',
    width: 200,
  },
  {
    code: 'address',
    title: '地址',
    width: 600,
    render: (value, rowData, index) => {
      return <span>{value} </span>
    },
  },
  {
    code: 'hobby',
    title: '爱好',
    width: 300,
  },
  {
    code: 'desc',
    title: '描述',
    width: 300,
  },
]

export default function App() {
  const [dataSource, setDataSource] = useState(getDataSource())
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const tablePipeline = usePipeline({ components: antd })
  tablePipeline
    .columns(columns)
    .dataSource(dataSource)
    .setPrimaryKey('id')
    .use(
      useSelectPipeline({
        selectedKeys,
        onSelect(selected, key, record) {
          const exist = selectedKeys.includes(key)
          if (selected && !exist) {
            setSelectedKeys(keys => [...keys, key])
          } else if (!selected && exist) {
            setSelectedKeys(keys => keys.filter(k => k !== key))
          }
        },
        toggleCheckAll(selected, keys) {
          setSelectedKeys(keys)
        },
      }),
    )

  return (
    <BaseTable
      virtual
      width={1000}
      rowHeight={48}
      height={600}
      rowKey="id"
      {...tablePipeline.getTableProps()}
    />
  )
}
