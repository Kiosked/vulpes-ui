import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { dispatch } from "../redux/index.js";
import { push } from "react-router-redux";

const ModalBackdrop = styled.div`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    padding: 50px;
`;

const ModalBox = styled.div`
    background-color: #fff;
    border-radius: 5px;
    max-width: 500px;
    min-height: 300px;
    margin: 0 auto;
    margin-top: 50px;
    padding: 30px;
    z-index: 12;
`;

const ModalContent = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const ModalFooter = styled.div`
    margin-top: 20px;
`;

class Modal extends Component {
    static propTypes = {
        goToJobPage: PropTypes.func.isRequired
    };

    goToJobPage(jobId) {
        this.props.onClose();
        this.props.goToJobPage(jobId);
    }

    render() {
        return (
            <ModalBackdrop>
                <ModalBox>
                    <h3>{this.props.data.id}</h3>
                    <ModalContent>
                        <span>
                            <strong>Type: </strong>
                        </span>
                        <span>{this.props.data.type}</span>
                    </ModalContent>
                    <ModalContent>
                        <span>
                            <strong>Status: </strong>
                        </span>
                        <span>{this.props.data.status}</span>
                    </ModalContent>
                    <ModalContent>
                        <span>
                            <strong>Priority: </strong>
                        </span>
                        <span>
                            <Choose>
                                <When condition={this.props.data.priority === 0}>Normal</When>
                                <When condition={this.props.data.priority === 5}>High</When>
                                <When condition={this.props.data.priority === -5}>Low</When>
                                <Otherwise>Unknown</Otherwise>
                            </Choose>
                        </span>
                    </ModalContent>
                    <a onClick={this.goToJobPage.bind(this, this.props.data.id)}>Go to Job Page</a>
                    <ModalFooter>
                        <button onClick={this.props.onClose}>Close</button>
                    </ModalFooter>
                </ModalBox>
            </ModalBackdrop>
        );
    }
}

export default Modal;
