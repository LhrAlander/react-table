import React, { useState } from 'react'
import BaseTable from '@/table'
import { IColumn } from '@/table/table.type'

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
    width: 30,
  },
  {
    code: 'name',
    title: '姓名',
    width: 90,
  },
  {
    code: 'age',
    title: '年龄',
    width: 200,
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
  },
  {
    code: 'hobby',
    title: '爱好',
    width: 300,
  },
  {
    code: 'desc',
    title: '描述',
    width: 500,
  },
]

export default function App() {
  const [dataSource] = useState(getDataSource())
  return <BaseTable columns={columns} dataSource={dataSource} />
}
