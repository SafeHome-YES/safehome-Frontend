import React from "react";
import {Row, Col} from "reactstrap";
import './Footer.css'
import githubLogo from "../assets/github-mark.svg"
const Footer = () => {
    const thisYear = new Date().getFullYear();
    return (
        <div className="footer">
        <Row className="justfy-content-center mb-2">
            <Col md="auto">
                {/* 나중에 로그 들어갈 자리 */}
                <h6> 🏠 집보장 </h6>
                <p className ="footer-description">
                    당신의 집 , 집보장이 안전하게 보장해드립니다. <br /> {/* 멘트수정 ㄱㄴ */}
                    범죄 , 조도 , CCTV 기반 안전 점수로 신뢰할 수 있는 주거 정보를 제공합니다.
                </p>
            </Col>
        </Row>
        <Row className = "justify-content-center mb-2">
            <Col md ="auto">
               <a href ="/intro">프로젝트소개</a> | <a href="/terms"> 이용약관</a> | <a href="/privacy"> 개인정보처리방침</a> | <a href="/manage"> 매물관리규정</a>
            </Col>
        </Row>

        {/**<Row className = "justify-content-center mb-2">
            <Col md ="auto">
                이메일 : parksoyo134@sookmyung.ac.kr | 예린언니메일 
            </Col>
        </Row>
        **/}
        <Row className="justify-content-center mb-2">
            <Col md="auto">
                <p>
                <a href="https://github.com/SafeHome-YES"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-github-link"
                >
                <img src = {githubLogo} alt ="Github" className="github-icon"/>
                </a>
                </p>
            </Col>
        </Row>
        <Row className="justify-content-center">
            <Col md="auto">
                <p>&copy; {new Date().getFullYear()} 집보장 (SafeHome Yes Team). All rights reserved.</p>
            </Col>
        </Row>
</div>


    );

}
export default Footer;