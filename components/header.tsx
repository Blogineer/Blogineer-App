import { Layout, Row, Col } from 'antd';
import logo from '../public/logo.png';

const { Header } = Layout;

export default function HeaderComponent() {
    return (
        <Header className="header" style={{ background: "#000" }}>
            <Row style={{ height: "100%"}}>
                <Col span={1} style={{ height: "100%"}}>
                    <div>
                        <img src={logo.src} alt="Logo" style={{ height: '60px' }}/>
                    </div>
                </Col>
                <Col span={4}>
                    <h1 style={{ color: "#fff", margin: 0 }}>Blogineer</h1>
                </Col>
            </Row>
        </Header>
    )
}