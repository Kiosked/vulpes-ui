import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
    Button,
    ButtonGroup,
    Card,
    Classes,
    Dialog,
    Icon,
    Intent,
    Spinner
} from "@blueprintjs/core";
import { LazyLog } from "react-lazylog";
import humanDate from "human-date";
import debounce from "debounce";
import { clearDownloadQueue, downloadAttachmentToDataURI } from "../library/attachments.js";

const ATTACHMENT_REXP = /^%attachment:[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
const MIME_IMAGE_REXP = /^image\//;
const MIME_TEXT_REXP = /(^text\/|^application\/(javascript|ecmascript|json))/;
const MIME_TYPE_LOADABLE = /^(text|image)\//;

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
    position: relative;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    &:hover {
        background-color: #eee;
    }
`;
const ItemRemoveButton = styled.div`
    position: absolute;
    right: -5px;
    top: -5px;
    width: 18px;
    height: 18px;
    border: 1px solid #000;
    border-radius: 9px;
    user-select: none;
    cursor: pointer;
    &:hover {
        box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.5);
    }
    background-color: #fff;
    font-size: 9px;
    z-index: 10;
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
const DateSubtitle = styled.span`
    color: #aaa;
    font-size: 11px;
    font-style: italic;
    width: 80%;
    text-align: center;
`;
const BigImage = styled.img`
    max-width: 100%;
    height: auto;
`;
const PreviewDialog = styled(Dialog)`
    width: 70vw;
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
        onRemoveAttachment: PropTypes.func.isRequired,
        results: PropTypes.object.isRequired
    };

    state = {
        attachmentData: {},
        presentedAttachment: null,
        removeAttachment: null
    };

    constructor(props) {
        super(props);
        this.fetchAllAttachments = debounce(this._fetchAllAttachments, 500, false);
    }

    get attachments() {
        return Object.keys(this.props.results)
            .filter(key => ATTACHMENT_REXP.test(key))
            .map(key => ({
                ...this.props.results[key],
                id: key.replace(/^%attachment:/, "")
            }))
            .sort((a, b) => b.created - a.created);
    }

    componentDidMount() {
        this.fetchAllAttachments();
    }

    componentDidUpdate() {
        this.fetchAllAttachments();
    }

    componentWillUnmount() {
        clearDownloadQueue();
    }

    _fetchAllAttachments() {
        this.attachments.forEach(attachment => {
            this.fetchAttachmentData(attachment.id);
        });
    }

    fetchAttachmentData(id) {
        if (this.state.attachmentData[id]) {
            return;
        }
        const { mime } = this.attachments.find(attachment => attachment.id === id);
        downloadAttachmentToDataURI(id, mime)
            .then(data => {
                this.setState({
                    attachmentData: {
                        ...this.state.attachmentData,
                        [id]: data
                    }
                });
            })
            .catch(err => {
                console.error(err);
            });
    }

    handleClickFile(attachment) {
        this.setState({
            presentedAttachment: attachment
        });
    }

    handleClickFileRemove(event, attachment) {
        event.preventDefault();
        event.stopPropagation();
        this.setState({
            removeAttachment: attachment
        });
    }

    removeSelectedAttachment() {
        this.props.onRemoveAttachment(this.state.removeAttachment.id);
        this.setState({
            removeAttachment: null
        });
    }

    render() {
        const attachments = this.attachments;
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
                                    <When
                                        condition={
                                            MIME_IMAGE_REXP.test(attachment.mime) &&
                                            this.state.attachmentData[attachment.id]
                                        }
                                    >
                                        <Image src={this.state.attachmentData[attachment.id]} />
                                    </When>
                                    <Otherwise>
                                        <NoImage>
                                            <Icon icon="document" />
                                        </NoImage>
                                    </Otherwise>
                                </Choose>
                            </ImageContainer>
                            <Title>{attachment.title}</Title>
                            <DateSubtitle>
                                {humanDate.prettyPrint(new Date(attachment.created), {
                                    showTime: true
                                })}
                            </DateSubtitle>
                            <ItemRemoveButton
                                onClick={evt => this.handleClickFileRemove(evt, attachment)}
                            >
                                <Icon icon="cross" />
                            </ItemRemoveButton>
                        </Item>
                    </For>
                </Items>
                <PreviewDialog
                    isOpen={!!this.state.presentedAttachment}
                    onClose={() =>
                        this.setState({ presentedAttachment: null, presentedAttachmentData: null })
                    }
                    title={
                        this.state.presentedAttachment ? this.state.presentedAttachment.title : ""
                    }
                >
                    <DialogContent>
                        <If condition={!!this.state.presentedAttachment}>
                            <Choose>
                                <When
                                    condition={
                                        !this.state.attachmentData[
                                            this.state.presentedAttachment.id
                                        ] &&
                                        MIME_TYPE_LOADABLE.test(this.state.presentedAttachment.mime)
                                    }
                                >
                                    <Spinner />
                                </When>
                                <Otherwise>
                                    <Choose>
                                        <When
                                            condition={MIME_IMAGE_REXP.test(
                                                this.state.presentedAttachment.mime
                                            )}
                                        >
                                            <BigImage
                                                src={
                                                    this.state.attachmentData[
                                                        this.state.presentedAttachment.id
                                                    ]
                                                }
                                            />
                                        </When>
                                        <When
                                            condition={MIME_TEXT_REXP.test(
                                                this.state.presentedAttachment.mime
                                            )}
                                        >
                                            <LazyLog
                                                url={
                                                    this.state.attachmentData[
                                                        this.state.presentedAttachment.id
                                                    ]
                                                }
                                                extraLines={2}
                                            />
                                        </When>
                                        <Otherwise>
                                            <NoContentMessage>
                                                No preview available
                                            </NoContentMessage>
                                        </Otherwise>
                                    </Choose>
                                </Otherwise>
                            </Choose>
                        </If>
                    </DialogContent>
                </PreviewDialog>
                <Dialog
                    title="Remove Attachment"
                    isOpen={!!this.state.removeAttachment}
                    onClose={() => this.setState({ removeAttachment: null })}
                >
                    <div className={Classes.DIALOG_BODY}>
                        Are you sure that you want to remove "
                        {this.state.removeAttachment ? this.state.removeAttachment.title : ""}"?
                    </div>
                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Button
                                intent={Intent.DANGER}
                                onClick={::this.removeSelectedAttachment}
                            >
                                Remove
                            </Button>
                            <Button onClick={() => this.setState({ removeAttachment: null })}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </Dialog>
            </Card>
        );
    }
}
