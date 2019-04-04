import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Card, Dialog, Icon } from "@blueprintjs/core";
import { LazyLog } from "react-lazylog";

const ATTACHMENT_REXP = /^%attachment:[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
const MIME_IMAGE_REXP = /^image\//;
const MIME_TEXT_REXP = /(^text\/|^application\/(javascript|ecmascript|json))/;

const Items = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
`;
const Item = styled.div`
    width: 120px;
    display: flex;
    padding: 4px;
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
const BigImage = styled.img`
    max-width: 100%;
    height: auto;
`;
const PreviewDialog = styled(Dialog)`
    width: 70vw;
    height
`;
const DialogContent = styled.div`
    width: 100%;
    height: 100%;
    min-height: 60vh;
    overflow-x: hidden;
    overflow-y: scroll;
`;
const NoContentMessage = styled.div`
    width: 100%;
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-style: italic;
    color: #aaa;
`;

export default class Attachments extends Component {
    static propTypes = {
        results: PropTypes.object.isRequired
    };

    state = {
        presentedAttachment: null
    };

    handleClickFile(attachment) {
        this.setState({
            presentedAttachment: attachment
        });
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
                <PreviewDialog
                    isOpen={!!this.state.presentedAttachment}
                    onClose={() => this.setState({ presentedAttachment: null })}
                    title={
                        this.state.presentedAttachment ? this.state.presentedAttachment.title : ""
                    }
                >
                    <DialogContent>
                        <If condition={!!this.state.presentedAttachment}>
                            <Choose>
                                <When
                                    condition={MIME_IMAGE_REXP.test(
                                        this.state.presentedAttachment.mime
                                    )}
                                >
                                    <BigImage src={this.state.presentedAttachment.data} />
                                </When>
                                <When
                                    condition={MIME_TEXT_REXP.test(
                                        this.state.presentedAttachment.mime
                                    )}
                                >
                                    <LazyLog
                                        url={this.state.presentedAttachment.data}
                                        extraLines={2}
                                    />
                                </When>
                                <Otherwise>
                                    <NoContentMessage>No preview available</NoContentMessage>
                                </Otherwise>
                            </Choose>
                        </If>
                    </DialogContent>
                </PreviewDialog>
            </Card>
        );
    }
}
