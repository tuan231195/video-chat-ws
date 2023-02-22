import { Layout, Modal, Space } from 'antd';
import { UserGroup } from 'src/types/group';
import React, { useEffect, useState } from 'react';

import {
	AudioMutedOutlined,
	AudioOutlined,
	StopTwoTone,
	VideoCameraAddOutlined,
	VideoCameraOutlined,
} from '@ant-design/icons';
import classnames from 'classnames';
import { joinVideoCall, leaveVideoCall } from 'src/store/actions/video-call';
import { useAppDispatch, useAppSelector } from 'src/store/store';
import { useMediaStream } from 'src/context/media-context';
import { CenterSpin } from 'src/components/common/CenterSpin';
import { UserVideo } from 'src/components/messages/UserVideo';
import { useUser } from 'src/context/session';
import { useCurrent } from 'src/lib/common/hooks';
import styles from './VideoCallModal.module.css';

const { Header: AppHeader } = Layout;

export const VideoCallModal = ({ group, onClose }: { group: UserGroup; onClose: () => void }) => {
	const [audio, setAudio] = useState(true);
	const [video, setVideo] = useState(true);
	const currentUser = useUser();
	const dispatch = useAppDispatch();
	const { loading, otherUsers, videoCallId } = useAppSelector((state) => state.videoCalls);
	const videoCallIdRef = useCurrent(videoCallId);

	const mediaStream = useMediaStream();

	useEffect(() => {
		dispatch(joinVideoCall(group.groupId));
	}, [group]);

	useEffect(
		() => () => {
			if (videoCallIdRef.current) {
				dispatch(leaveVideoCall({ groupId: group.groupId, videoCallId: videoCallIdRef.current }));
			}
		},
		[]
	);

	const onToggleVideo = () => {
		setVideo(!video);
	};

	const onToggleAudio = () => {
		setAudio(!audio);
	};

	const AudioIcon = audio ? AudioOutlined : AudioMutedOutlined;
	const VideoIcon = video ? VideoCameraAddOutlined : VideoCameraOutlined;

	const videoView = () => (
		<div className={styles['videos-container']}>
			<div className={styles['video-current']}>
				<UserVideo user={currentUser} stream={mediaStream.userStream} audio={audio} video={video} />
			</div>
			{!!otherUsers.length && (
				<div className={styles['video-others']}>
					{otherUsers.map((user) => (
						<div className={styles['video-other']}>
							<UserVideo user={user} key={user.id} stream={mediaStream.get(user.id)?.remoteStream} />
						</div>
					))}
				</div>
			)}
		</div>
	);

	return (
		<Modal
			title={
				<AppHeader className={styles['video-header']}>
					<span>{group.group.name}</span>
				</AppHeader>
			}
			open
			onCancel={onClose}
			footer={
				<div className={styles['video-footer']}>
					<Space size={10} direction={'horizontal'}>
						<AudioIcon
							className={classnames(styles['video-control'], {
								[styles['video-control--disabled']]: !audio,
							})}
							onClick={onToggleAudio}
						/>
						<StopTwoTone className={styles['video-control-end']} onClick={onClose} twoToneColor={'red'} />
						<VideoIcon
							className={classnames(styles['video-control'], {
								[styles['video-control--disabled']]: !video,
							})}
							onClick={onToggleVideo}
						/>
					</Space>
				</div>
			}
			className={styles.modal}>
			{loading && <CenterSpin />}
			{!loading && videoView()}
		</Modal>
	);
};
