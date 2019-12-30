declare var RTCPeerConnection: any;

export class HjVideoCall {
    private messageEvents = {
        MESSAGE: 'message',
        CALLING: 'calling',
        REFUSE_CALL: 'refuseCall',
        CALL_OFF: 'callOff',
        OFFER: 'offer',
        ANSWER: 'answer',
        CANDIDATE: 'candidate',
        ERROR_RECEIVE_CALL: 'errorReceiverCall',
        ERROR_SENDER_CALL: 'errorSenderCall',
        TOOGLE_VIDEO: 'toogleVideo',
        RECONNECTION_CALL: 'reconnectionCall',
        REMAKE_CALL: 'remakeCall'
    }
    private EnumConsultationViewState = {
        LOCAL_AND_REMOTE_VIDEO_CALL: 'LOCAL_AND_REMOTE_VIDEO_CALL',
        LOCAL_VIDEO_CALL: 'LOCAL_VIDEO_CALL',
        REMOTE_VIDEO_CALL: 'REMOTE_VIDEO_CALL',
        AUDIO_CALL: 'AUDIO_CALL'
    };

    private inCall = false;

    private pc;
    private remoteStream;
    private localStream;
    private localVideo = undefined;
    private remoteVideo = undefined;
    private audioVideo = {
        audio: false,
        video: false
    };
    private queuedRemoteCandidates = null;
    private calling = undefined;
    private iMessage = undefined;
    private iIceGatheringStateChange = undefined;
    private iIceconnectionStateChange = undefined;
    private config: any;
    private data: any;
    private userLoged: any;
    private dataConsultation: any;
    private socketio: any;
    private iceServers: any;

    /////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////CONSTRUTOR///////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////

    constructor(_userLoged, _dataConsultation, _socketio, _iceServers) {
        const _self = this;

        _self.userLoged = _userLoged;
        _self.dataConsultation = _dataConsultation;
        _self.socketio = _socketio;
        _self.iceServers = _iceServers;

        _socketio.removeAllListeners(_self.messageEvents.CALLING);
        _socketio.removeAllListeners('message');

        _self.config = {
            peerConnectionConstraints: {
                optional: [
                    { DtlsSrtpKeyAgreement: true },
                    { googCpuOveruseDetection: false }
                ]
            }
        };

        _self.data = {
            call_user: _userLoged,
            call_receiver_user: '',
            audioVideo: {
                localVideo: false,
                remoteVideo: false,
                idUserAction: ''
            },
            user_receiver: _dataConsultation.user_receiver.id,
            user_sender: _dataConsultation.user_sender.id
        };

        _socketio.on(_self.messageEvents.CALLING, function (dataTemp) {
            if (dataTemp.call_user.id === _userLoged.id) {
                if (typeof _self.pc === 'undefined') {
                    // console.log('You request a calling to: ' + dataTemp.call_receiver_user.id + ' inCall: ' + _self.inCall);
                    // console.log(dataTemp);
                    if (_self.inCall) {
                        // createUserMedia(audioVideo);
                        // _self.requestCalling(dataTemp);
                    }
                } else {
                    // console.log('You request a toggle video to: ' + dataTemp.call_receiver_user.id);
                    // console.log('Video to: ' + dataTemp.audioVideo.video);
                }
            } else {
                _self.data = dataTemp;
                // console.log('calling recebendo chamada');
                // console.log(dataTemp);
                if (typeof _self.pc === 'undefined') {
                    // console.log('recebendo chamada');
                    if (typeof _self.calling !== 'undefined') {
                        _self.calling(dataTemp);
                    }
                } else {
                    // console.log('recebendo toggle video');
                    if (typeof _self.calling !== 'undefined') {
                        _self.calling(dataTemp, true);
                    }
                }
            }
        });

        _socketio.on('message', function (message) {
            // console.log(message);
            if (typeof message == 'undefined') {
                // console.log('message temp.message is undefined');
                return;
            }

            let retorno = {
                message: message.type,
                data: _self.data,
                myError: null,
                videocall: null,
                enumConsultationViewState: null
            };
            if (message.type === _self.messageEvents.CALL_OFF) {
                _self.inCall = false;
                // console.log('on message callOff!');
                // do nothing
            } else if (message.type === _self.messageEvents.REFUSE_CALL) {
                if (_self.data.call_user.id === _userLoged.id) {
                    // console.log('on message refuseCall!');
                } else {
                    retorno = undefined;
                    // console.log('you refuseCall!');
                }
            } else if (message.type === _self.messageEvents.RECONNECTION_CALL) {
                // do nothing
            } else if (message.type === _self.messageEvents.OFFER) {
                _self.inCall = true;
                if (_self.data.call_user.id == _userLoged.id) {
                    // console.log('on message offer1: ' + _self.data.call_user.id);
                    // console.log('on message offer2: ' + _userLoged.id);
                    // console.log('on message offer');
                    // addStream(message);
                    _self.prepareStream(message);
                } else {
                    // console.log('you sent a message offer');
                }
            } else if (message.type === _self.messageEvents.ANSWER) {
                _self.inCall = true;
                // console.log('ANSWER: id: ' + _self.data.call_receiver_user.id + ' userLoged.id: ' + _userLoged.id);
                if (_self.data.call_receiver_user.id == _userLoged.id) {
                    // console.log('on message answer');
                    if (typeof _self.pc !== 'undefined' && typeof _self.remoteStream !== 'undefined') {
                        // console.log('toggle video, remove remote stream');
                    }
                    _self.pc.setRemoteDescription(new RTCSessionDescription(message));
                    _self.drainCandidates();
                } else {
                    // console.log('you sent a message answer');
                }
            } else if (message.type === _self.messageEvents.CANDIDATE) {
                if (message.user_id != _userLoged.id) {
                    // console.log('on message candidate!', message);
                    let candidate = new RTCIceCandidate({
                        sdpMLineIndex: message.label,
                        sdpMid: message.id,
                        candidate: message.candidate
                    });
                    if (typeof _self.pc !== 'undefined' && _self.pc !== null && _self.pc !== 'null' && _self.pc.remoteDescription) {
                        // console.log('ICE_SERVER addIceCandidate ADDED');
                        _self.pc.addIceCandidate(candidate);
                    } else {
                        if (_self.queuedRemoteCandidates === null) {
                            _self.queuedRemoteCandidates = [];
                        }
                        // console.log('ICE_SERVER addIceCandidate ADD QUEUED');
                        _self.queuedRemoteCandidates.push(candidate);
                    }
                } else {
                    // console.log('you sent a message candidate!');
                }
            } else if (message.type === _self.messageEvents.ERROR_RECEIVE_CALL || message.type === _self.messageEvents.ERROR_SENDER_CALL) {
                // console.log(_self.data.call_user.id)
                // console.log(_userLoged.id)
                // console.log(_self.data.call_receiver_user.id)
                if (message.type === _self.messageEvents.ERROR_SENDER_CALL) {
                    if (_self.data.call_user.id === _userLoged.id) {
                        retorno.myError = true;
                    } else {
                        retorno.myError = false;
                    }
                } else if (message.type === _self.messageEvents.ERROR_RECEIVE_CALL) {
                    if (_self.data.call_user.id === _userLoged.id) {
                        retorno.myError = false;
                    } else {
                        retorno.myError = true;
                    }
                }
                _self.inCall = false;
                // console.log(retorno)
            } else if (message.type === _self.messageEvents.TOOGLE_VIDEO) {
                // console.log('on message videocall!');
                retorno.data.audioVideo.idUserAction = message.id_user_action;

                if (_userLoged.id == message.id_user_action) {
                    retorno.data.audioVideo.localVideo = message.toogle_video;
                    _self.data.audioVideo.localVideo = message.toogle_video;

                    if (typeof _self.localStream !== 'undefined' && _self.localStream.getVideoTracks().length > 0) {
                        if (!retorno.data.audioVideo.localVideo) {
                            setTimeout(function () {
                                _self.localStream.getVideoTracks()[0].enabled = retorno.data.audioVideo.localVideo;
                            }, 1000);
                        } else {
                            _self.localStream.getVideoTracks()[0].enabled = retorno.data.audioVideo.localVideo;
                        }
                    }
                } else {
                    retorno.data.audioVideo.remoteVideo = message.toogle_video;
                    _self.data.audioVideo.remoteVideo = message.toogle_video;
                }

                retorno.videocall = _self.data.audioVideo.localVideo && _self.data.audioVideo.remoteVideo ? true : false;

                if (_self.data.audioVideo.remoteVideo && _self.data.audioVideo.localVideo) {
                    retorno.enumConsultationViewState = _self.EnumConsultationViewState.LOCAL_AND_REMOTE_VIDEO_CALL;
                } else if (!_self.data.audioVideo.remoteVideo && _self.data.audioVideo.localVideo) {
                    retorno.enumConsultationViewState = _self.EnumConsultationViewState.LOCAL_VIDEO_CALL;
                } else if (_self.data.audioVideo.remoteVideo && !_self.data.audioVideo.localVideo) {
                    retorno.enumConsultationViewState = _self.EnumConsultationViewState.REMOTE_VIDEO_CALL;
                } else {
                    retorno.enumConsultationViewState = _self.EnumConsultationViewState.AUDIO_CALL;
                }
            }

            if (typeof _self.iMessage !== 'undefined' && typeof retorno !== 'undefined') {
                _self.iMessage(retorno);
            }
        });

        window.onbeforeunload = function () {
            _self.sendMessage({ type: 'bye' });
        };
    }

    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////VARIAVEIS PUBLICAS//////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////
    public getAudioActive() {
        const _self = this;
        return _self.audioVideo.audio;
    }

    public getVideoActive() {
        const _self = this;
        return _self.audioVideo.video;
    }

    public forceDisconnect() {
        const _self = this;
        _self.pc.close();
    };
    public getMessageEvents() {
        const _self = this;
        return _self.messageEvents;
    }
    public getData() {
        const _self = this;
        return _self.data;
    };
    public getUserLoged() {
        const _self = this;
        return _self.userLoged;
    };
    public setLocalVideo(local) {
        const _self = this;
        _self.localVideo = local;
    };
    public getLocalVideo() {
        const _self = this;
        return _self.localVideo;
    };
    public setRemoteVideo(remote) {
        const _self = this;
        _self.remoteVideo = remote;
    };
    public getRemoteVideo() {
        const _self = this;
        return _self.remoteVideo;
    };
    public call(videocall, openConsult) {
        const _self = this;
        _self.inCall = true;
        _self.setRequestCalling();
        _self.data.audioVideo = {
            localVideo: videocall,
            remoteVideo: videocall,
            idUserAction: ''
        };
        _self.data.openConsult = openConsult;
        // console.log(_self.data);
        console.debug(JSON.stringify(_self.data));

        _self.createUserMedia(_self.audioVideo);
        _self.requestCalling(_self.data);
    };
    public incomingCall() {
        const _self = this;
        _self.inCall = true;
        _self.trace('Requesting local stream');
        // console.log(_self.data);
        if (typeof _self.pc !== 'undefined') {
            // console.log('toggle video, remove local stream');
        }
        navigator.mediaDevices.enumerateDevices()
            .then(function (deviceInfos) {
                for (var i = 0; i !== deviceInfos.length; ++i) {
                    var deviceInfo = deviceInfos[i];
                    var option = document.createElement('option');
                    option.value = deviceInfo.deviceId;
                    switch (deviceInfo.kind) {
                        case 'audioinput':
                            _self.audioVideo.audio = true;
                            break;
                        case 'videoinput':
                            _self.audioVideo.video = true;
                            break;
                    }
                }

                if (_self.audioVideo.audio || _self.audioVideo.video) {
                    navigator.mediaDevices.getUserMedia(_self.audioVideo)
                        .then(function (stream) {
                            _self.trace('Received local stream');
                            if (typeof _self.localVideo === 'undefined') {
                                return;
                            } else if (!_self.inCall) {
                                // console.log('Chamada finalizada!');
                                return;
                            }

                            _self.localVideo.srcObject = stream;
                            _self.localStream = stream;
                            _self.setVideo(_self.data.audioVideo.localVideo);
                            try {
                                _self.createRTCPeerConnection();
                            } catch (e) {
                                // console.log('Failed to create PeerConnection, exception: ' + e.message);
                                _self.sendMessage({ type: 'errorReceiverCall' });
                            }
                            _self.pc.addStream(_self.localStream);
                            _self.createOffer();
                        })
                        .catch(function (e) {
                            _self.sendMessage({ type: 'errorReceiverCall' });
                        });
                } else {
                    _self.sendMessage({ type: 'errorReceiverCall' });
                }
            })
            .catch(function (e) {
                _self.sendMessage({ type: 'errorSenderCall' });
            });
    };
    public toggleAudio(audiocall) {
        const _self = this;
        if (typeof _self.localStream !== 'undefined' && _self.localStream.getAudioTracks().length > 0 && _self.audioVideo.audio) {
            _self.localStream.getAudioTracks()[0].enabled = audiocall;
        }
    };
    public toggleVideo(localVideo, idUserAction) {
        const _self = this;
        if (typeof _self.localStream !== 'undefined' && _self.localStream.getVideoTracks().length > 0 && _self.audioVideo.video) {
            _self.sendMessage({ type: 'toogleVideo', toogle_video: localVideo, id_user_action: idUserAction });
        }
    };
    public callOff() {
        const _self = this;
        // console.log('callOff.');
        _self.inCall = false;
        _self.sendMessage({ type: _self.messageEvents.CALL_OFF });
    };
    public refuseCall() {
        const _self = this;
        _self.sendMessage({ type: _self.messageEvents.REFUSE_CALL });
    };
    public reconnectingCall() {
        const _self = this;
        _self.sendMessage({ type: _self.messageEvents.RECONNECTION_CALL });
    };
    public remakeCall() {
        const _self = this;
        _self.sendMessage({ type: _self.messageEvents.REMAKE_CALL });
    };
    public stopCall() {
        const _self = this;
        _self.inCall = false;
        // console.log('Session terminated.');
        if (typeof _self.pc !== 'undefined' && _self.pc !== null && _self.pc !== 'null') {
            _self.pc.close();
            _self.pc = undefined;
        }
        if (typeof _self.localVideo !== 'undefined') {
            _self.localVideo.pause();
            _self.localVideo.src = null;
        }
        if (typeof _self.remoteVideo !== 'undefined') {
            _self.remoteVideo.pause();
            _self.remoteVideo.src = null;
        }
        // console.log(_self.localStream);
        if (typeof _self.localStream !== 'undefined') {
            if (_self.audioVideo.audio && _self.localStream.getAudioTracks().length > 0) {
                _self.localStream.getAudioTracks()[0].stop();
            }
            if (_self.audioVideo.video && _self.localStream.getVideoTracks().length > 0) {
                _self.localStream.getVideoTracks()[0].stop();
            }
            _self.localStream = undefined;
        }
        // console.log(_self.remoteStream);
        if (typeof _self.remoteStream !== 'undefined') {
            if (_self.remoteStream.getAudioTracks().length > 0) {
                _self.remoteStream.getAudioTracks()[0].stop();
            }
            if (_self.remoteStream.getVideoTracks().length > 0) {
                _self.remoteStream.getVideoTracks()[0].stop();
            }
            _self.remoteStream = undefined;
        }
    };
    public onCalling(listener) {
        const _self = this;
        _self.calling = listener;
    };
    public OnRequestCalling(listener) {
        const _self = this;
        _self.requestCalling(listener);
    };
    public oniMessage(listener) {
        const _self = this;
        _self.iMessage = listener;
    };
    public oniIceGatheringStateChange(listener) {
        const _self = this;
        _self.iIceGatheringStateChange = listener;
    };
    public oniIceconnectionStateChange(listener) {
        const _self = this;
        _self.iIceconnectionStateChange = listener;
    };

    /////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////VARIAVEIS PRIVADAS/////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////

    private requestCalling(fcn) {
        // fcn é uma função
    }
    private setRequestCalling() {
        const _self = this;
        _self.data.call_user = _self.userLoged;
        // console.log('setRequestCalling');
        // console.log(_self.dataConsultation);
        if (_self.userLoged.id != _self.dataConsultation.user_receiver.id) {
            _self.data.call_receiver_user = _self.dataConsultation.user_receiver;
        } else {
            _self.data.call_receiver_user = _self.dataConsultation.user_sender;
        }
    }
    private setVideo(video) {
        const _self = this;
        if (typeof _self.localStream !== 'undefined' && _self.localStream.getVideoTracks().length > 0) {
            _self.localStream.getVideoTracks()[0].enabled = video;
        }
    }
    private createOffer() {
        const _self = this;
        // console.log('Sending offer to peer');
        _self.pc.createOffer(function (sessionDescription) {
            sessionDescription.sdp = _self.preferOpus(sessionDescription.sdp);
            // console.log('createOffer success! and camera on');
            _self.pc.setLocalDescription(sessionDescription);
            // console.log('createOffer setLocalAndSendMessage sending message', sessionDescription);
            _self.sendMessage(sessionDescription);
        }, function (event) {
            // console.log('createOffer() error: ', event);
        });
    }
    private createRTCPeerConnection() {
        const _self = this;
        if (typeof _self.pc === 'undefined') {
            _self.queuedRemoteCandidates = [];
            _self.pc = new RTCPeerConnection(_self.getIceServers(), _self.config.peerConnectionConstraints);
            _self.pc.onicecandidate = function (event) {
                let ice = event.candidate;
                if (ice) {
                    let candidate = ice.candidate;
                    if (candidate.indexOf('typ host') !== -1) {
                        // console.log('HOST SERVER ######', candidate);
                    } else {
                        // console.log('NOT A HOST SERVER ######', candidate);
                    }

                    _self.sendMessage({
                        type: 'candidate',
                        label: ice.sdpMLineIndex,
                        id: ice.sdpMid,
                        candidate: ice.candidate,
                        user_id: _self.userLoged.id
                    });
                } else {
                    // console.log('End of candidates.');
                }
            };
            _self.pc.onaddstream = function (event) {
                _self.remoteVideo.src = window.URL.createObjectURL(event.stream);
                _self.remoteStream = event.stream;
            };
            _self.pc.onremovestream = function (event) {
                // console.log('ICE_SERVER Remote stream removed. Event: ', event);
            };
            _self.pc.oniceconnectionstatechange = function (event) {
                if (typeof _self.pc !== 'undefined') {
                    // console.log('ICE_SERVER handleIceconnectionstatechange. Event: ', _self.pc.iceConnectionState);
                    if (typeof _self.iIceconnectionStateChange !== 'undefined') {
                        _self.iIceconnectionStateChange(_self.pc.iceConnectionState);
                    }
                }
            };
            _self.pc.onicegatheringstatechange = function (event) {
                if (typeof _self.pc !== 'undefined') {
                    // console.log('ICE_SERVER handleIceGatheringStateChange. Event: ', _self.pc.iceGatheringState);
                    if (typeof _self.iIceconnectionStateChange !== 'undefined') {
                        _self.iIceGatheringStateChange(_self.pc.iceGatheringState);
                    }
                }
            };
            // console.log('Created RTCPeerConnnection');
        } else {
            // console.log('RTCPeerConnnection has been created.');
        }
    }
    private drainCandidates() {
        const _self = this;
        // console.log('ICE_SERVER drainCandidates');
        if (_self.queuedRemoteCandidates !== null && typeof _self.pc !== 'undefined') {
            // console.log('ICE_SERVER queuedRemoteCandidates: ' + _self.queuedRemoteCandidates.length + 'remote candidates');
            for (let i = 0; i < _self.queuedRemoteCandidates.length; i++) {
                _self.pc.addIceCandidate(_self.queuedRemoteCandidates[i]);
            }
            _self.queuedRemoteCandidates = null;
        }
    }
    private createUserMedia(audioVideo) {
        const _self = this;
        navigator.mediaDevices.enumerateDevices()
            .then(function (deviceInfos) {
                for (var i = 0; i !== deviceInfos.length; ++i) {
                    var deviceInfo = deviceInfos[i];
                    var option = document.createElement('option');
                    option.value = deviceInfo.deviceId;
                    switch (deviceInfo.kind) {
                        case 'audioinput':
                            _self.audioVideo.audio = true;
                            break;
                        case 'videoinput':
                            _self.audioVideo.video = true;
                            break;
                    }
                }

                if (_self.audioVideo.audio || _self.audioVideo.video) {
                    navigator.mediaDevices.getUserMedia(audioVideo)
                        .then(function (stream) {
                            if (_self.inCall) {
                                _self.localVideo.srcObject = stream;
                                _self.localStream = stream;
                                _self.setVideo(_self.data.audioVideo.localVideo);

                                _self.socketio.emit(_self.messageEvents.CALLING, _self.data);
                            } else {
                            }
                        })
                        .catch(function (e) {
                            _self.localStream = 'errorSenderCall';
                            _self.sendMessage({ type: 'errorSenderCall' });
                        });
                }
                else {
                    _self.localStream = 'errorSenderCall';
                    _self.sendMessage({ type: 'errorSenderCall' });
                }
            })
            .catch(function (e) {
                _self.localStream = 'errorSenderCall';
                _self.sendMessage({ type: 'errorSenderCall' });
            });
    }
    private sendMessage(message) {
        const _self = this;
        // console.log('data: ', _self.data);
        _self.socketio.emit(_self.messageEvents.MESSAGE, { data: _self.data, message: message });
    }
    private prepareStream(message) {
        const _self = this;
        try {
            // console.log('********************Teste***********************');
            // console.log(_self.localStream);
            // console.log(message);
            if (typeof _self.localStream === 'undefined') {
                // console.log('prepareStream: media permission nt yet allowed, await for permission!');
                _self.localStream = { type: 'waitForPermission', message: message };
            } else if (_self.localStream === 'errorSenderCall') {
                // console.log('prepareStream: media permission denied');
                _self.sendMessage({ type: 'errorSenderCall' });
            } else {
                _self.createRTCPeerConnection();
                _self.pc.addStream(_self.localStream);
                _self.pc.setRemoteDescription(new RTCSessionDescription(message));
                _self.drainCandidates();
                _self.doAnswer();
            }
        } catch (e) {
            // console.log('Failed to create PeerConnection, exception: ' + e.message);
            // console.log('prepareStream errorSenderCall');
            _self.sendMessage({ type: 'errorSenderCall' });
        }
    }
    private doAnswer() {
        const _self = this;
        // console.log('Sending answer to peer.');
        _self.pc.createAnswer().then(
            function (sessionDescription) {
                sessionDescription.sdp = _self.preferOpus(sessionDescription.sdp);
                // console.log('createAnswer success! and camera on');
                _self.pc.setLocalDescription(sessionDescription);
                // console.log('createAnswer setLocalAndSendMessage sending message', sessionDescription);
                _self.sendMessage(sessionDescription);
            },
            function (error) {
                _self.trace('ICE_SERVER Failed to create session description: ' + error.toString());
            }
        );
    }
    private preferOpus(sdp) {
        const _self = this;
        let sdpLines = sdp.split('\r\n');
        let mLineIndex;
        for (let i = 0; i < sdpLines.length; i++) {
            if (sdpLines[i].search('m=audio') !== -1) {
                mLineIndex = i;
                break;
            }
        }
        if (mLineIndex === null) {
            return sdp;
        }

        for (let i = 0; i < sdpLines.length; i++) {
            if (sdpLines[i].search('opus/48000') !== -1) {
                let opusPayload = _self.extractSdp(sdpLines[i], /:(\d+) opus\/48000/i);
                if (opusPayload) {
                    sdpLines[mLineIndex] = _self.setDefaultCodec(sdpLines[mLineIndex],
                        opusPayload);
                }
                break;
            }
        }

        sdpLines = _self.removeCN(sdpLines, mLineIndex);
        sdp = sdpLines.join('\r\n');
        return sdp;
    }
    private extractSdp(sdpLine, pattern) {
        const _self = this;
        let result = sdpLine.match(pattern);
        return result && result.length === 2 ? result[1] : null;
    }
    private setDefaultCodec(mLine, payload) {
        const _self = this;
        let elements = mLine.split(' ');
        let newLine = [];
        let index = 0;
        for (let i = 0; i < elements.length; i++) {
            if (index === 3) {
                newLine[index++] = payload;
            }
            if (elements[i] !== payload) {
                newLine[index++] = elements[i];
            }
        }
        return newLine.join(' ');
    }
    private removeCN(sdpLines, mLineIndex) {
        const _self = this;
        let mLineElements = sdpLines[mLineIndex].split(' ');
        for (let i = sdpLines.length - 1; i >= 0; i--) {
            let payload = _self.extractSdp(sdpLines[i], /a=rtpmap:(\d+) CN\/\d+/i);
            if (payload) {
                let cnPos = mLineElements.indexOf(payload);
                if (cnPos !== -1) {
                    mLineElements.splice(cnPos, 1);
                }
                sdpLines.splice(i, 1);
            }
        }

        sdpLines[mLineIndex] = mLineElements.join(' ');
        return sdpLines;
    }
    private trace(text) {
        const _self = this;
        if (text[text.length - 1] === '\n') {
            text = text.substring(0, text.length - 1);
        }
        if (window.performance) {
            let now = (window.performance.now() / 1000).toFixed(3);
            // console.log(now + ': ' + text);
        } else {
            // console.log(text);
        }
    }
    private getIceServers() {
        const servers = {
            iceServers: this.iceServers
        };
        return servers;
    }
}