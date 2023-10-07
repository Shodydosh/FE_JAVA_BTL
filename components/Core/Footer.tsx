import React from 'react'

import { Layout, Typography } from 'antd';

import { EnvironmentOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';

import Image from 'next/image';

import branch1 from 'app/assets/images/branch1.png';

import ghn from 'app/assets/images/ghn.png'

import ghtk from 'app/assets/images/ghtk.png'

import ems from 'app/assets/images/ems.png'

import jandt from 'app/assets/images/jandt.png'

import money from 'app/assets/images/money.png'

const { Text } = Typography;

const { Header, Content, Footer, Sider } = Layout;

const FooterView = () => {
  return (
    <Footer style={{display:'flex',  flexDirection:'row', alignContent:'space-between'}}>
      <div style={{display:'flex', flexDirection:'column' }}>
        <Image src={branch1} alt="My Image" className = "w-120 h-20  ml-[-70px]" />
        <span style={{ fontWeight:'500'}}>
          <EnvironmentOutlined style={{ marginRight: '6px' }}/> 
          Km 10, Đường Nguyễn Trãi, Hà Nội – Hà Đông
        </span>
        <span style={{marginTop: '12px', fontWeight:'500'}}>
          <PhoneOutlined style={{ marginRight: '6px' }}/> 
          0987654321
        </span>
        <span style={{marginTop: '12px', fontWeight:'500'}}>
          <MailOutlined style={{ marginRight: '6px' }}/> 
          dungvaoptit@gmail.com
        </span>
      </div>
      <div style={{display:'flex', flexDirection:'column', marginLeft:'36px'}}>
          <Text style={{fontWeight:'bold', color:'#1890ff', fontSize: 16}}>
            Thông tin chung
          </Text>
          <Text style={{fontWeight:'500', marginTop: '12px'}}>
            Giới thiệu
          </Text>
      </div>
      <div style={{display:'flex', flexDirection:'column', marginLeft:'36px'}}>
          <Text style={{fontWeight:'bold', color:'#1890ff', fontSize: 16}}>
            Hướng dẫn mua bán
          </Text>
          <Text style={{fontWeight:'500', marginTop: '12px'}}>
            Chính Sách Vận Chuyển - Giao Hàng
          </Text>
          <Text style={{ fontWeight:'500', marginTop: '3px' }}>
            Chính Sách Bảo Hành Đổi Trả
          </Text>
      </div>
      <div style={{display:'flex', flexDirection:'column', marginLeft:'90px'}}>
          <Text style={{fontWeight:'bold', color:'#1890ff', fontSize: 16}}>
            Đơn Vị Vận Chuyển
          </Text>
          <div style={{display:'flex', flexDirection:'row', marginTop:'6px'}}>
            <Image src={ghn} alt="My Image" className = "w-20 h-12" />
            <Image src={ghtk} alt="My Image" className = "w-20 h-12" />
            <Image src={ems} alt="My Image" className = "w-20 h-12" />
            <Image src={jandt} alt="My Image" className = "w-20 h-12" />
          </div>
          <Text style={{fontWeight:'bold', color:'#1890ff', fontSize: 16, marginTop: '6px' }}>
            Hình thức thanh toán
          </Text>
          <Text style={{ fontWeight:'500', marginTop: '3px' }}>
            Chuyển khoản
          </Text>
          <Text style={{ fontWeight:'500', marginTop: '3px' }}>
            Tiền mặt
          </Text>
      </div>
    </Footer> 
  )
}

export default FooterView