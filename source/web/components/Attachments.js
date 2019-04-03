import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Card, Icon } from "@blueprintjs/core";

const ATTACHMENT_REXP = /^%attachment:[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
const MIME_IMAGE_REXP = /^image\//;

const Items = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
`;
const Item = styled.div`
    width: 120px;
    display: flex;
    padding: 2px;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    &:hover {
        background-color: #eee;
    }
`;
const ImageContainer = styled.div`
    width: 110px;
    height: 110px;
    overflow: hidden;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: linear-gradient(
        45deg,
        #f2f2f2 22.73%,
        #e8e8e8 22.73%,
        #e8e8e8 50%,
        #f2f2f2 50%,
        #f2f2f2 72.73%,
        #e8e8e8 72.73%,
        #e8e8e8 100%
    );
    background-size: 31.11px 31.11px;
`;
const Image = styled.img`
    width: 100%;
    height: auto;
`;
const NoImage = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const Title = styled.div`
    text-align: center;
`;

export default class Attachments extends Component {
    static propTypes = {
        results: PropTypes.object.isRequired
    };

    handleClickFile(attachment) {
        if (MIME_IMAGE_REXP.test(attachment.mime)) {
            // todo
        } else {
            // todo
        }
    }

    render() {
        const attachments = Object.keys(this.props.results)
            .filter(key => ATTACHMENT_REXP.test(key))
            .map(key => ({
                ...this.props.results[key],
                id: key
            }));
        if (attachments.length <= 0) {
            return null;
        }
        return (
            <Card>
                <Items>
                    <For each="attachment" of={attachments}>
                        <Item key={attachment.id} onClick={() => this.handleClickFile(attachment)}>
                            <ImageContainer>
                                <Choose>
                                    <When condition={MIME_IMAGE_REXP.test(attachment.mime)}>
                                        <Image src={attachment.data} />
                                    </When>
                                    <Otherwise>
                                        <NoImage>
                                            <Icon icon="document" />
                                        </NoImage>
                                    </Otherwise>
                                </Choose>
                            </ImageContainer>
                            <Title>{attachment.title}</Title>
                        </Item>
                    </For>
                </Items>
            </Card>
        );
    }
}
