import React from 'react'

import Image from 'next/image';

import { Breadcrumb, Layout, Menu, Button, Input, Typography } from 'antd';

import branch1 from 'app/assets/images/branch1.png';

import bluecart from 'app/assets/images/bluecart.png'

const { Header, Content, Footer, Sider } = Layout;

const { Search } = Input;

const { Text } = Typography;

const HeaderView = () => {

  const onSearch = (value: any, _e: any, info: any) => console.log(info?.source, value);

  return (
    <Header className='flex items-center justify-between bg-white'>
    {/* <div className="text-xl text-white">JAVA_BTL</div> */}
    <div className='ml-[-60px] flex items-center'>
      <Image src={branch1} alt="My Image" className = "w-120 h-20" />
      <Search
        placeholder="Search..."
        onSearch={onSearch}
        style={{ marginRight: 16, marginLeft: 32 }}
      />
    </div>
    <div className="flex items-center">
        <Button style={{position:'relative', marginRight: '32px', border:'0' }}>
          <Image src={bluecart} alt="My Image" className = "w-5 h-5" />
          <span style={{
            position:'absolute', 
            top:0, left: '80%', 
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: '#1890ff',
            color: 'white',
            padding: '2px 5px',
            fontSize:'12px'
          }}
          >
            1{' '}
          </span>
        </Button>
      
      <Button type="primary" className='bg-blue-400'>
        <Text style={{ fontWeight: 'bold', color: 'white' }}>Login / Sign up</Text>
      </Button>
    </div>
</Header>
  )
}

export default HeaderView