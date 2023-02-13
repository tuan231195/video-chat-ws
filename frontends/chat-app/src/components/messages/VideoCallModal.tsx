import { Layout, Modal } from 'antd';
import { UserGroup } from 'src/types/group';
import { useEffect, useRef, useState } from 'react';
import { getUserMedia } from 'src/lib/common/video';
import { Logger } from 'src/services';

import { AudioMutedOutlined, AudioOutlined, VideoCameraAddOutlined, VideoCameraOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import styles from './VideoCallModal.module.css';

const { Header: AppHeader } = Layout;

export const VideoCallModal = ({ group, onClose }: { group: UserGroup; onClose: () => void }) => {
	const localVideoRef = useRef<HTMLVideoElement>(null);
	const [audio, setAudio] = useState(true);
	const [video, setVideo] = useState(true);

	const playVideoStream = (videoRef: HTMLVideoElement, stream: any) => {
		// eslint-disable-next-line no-param-reassign
		videoRef.srcObject = stream;
		videoRef.addEventListener('loadedmetadata', async () => {
			await videoRef.play();
		});
	};

	useEffect(() => {
		const videoRef = localVideoRef.current;
		if (videoRef) {
			const constraints = {
				video,
				audio,
			};
			const onSuccess = (stream: any) => {
				playVideoStream(videoRef, stream);
			};
			getUserMedia(constraints, onSuccess, Logger.error);
		}
	}, []);

	const onToggleVideo = () => {
		setVideo(!video);
		const videoRef = localVideoRef.current;
		if (videoRef) {
			(videoRef.srcObject as MediaStream).getVideoTracks()[0].enabled = !video;
		}
	};

	const onToggleAudio = () => {
		setAudio(!audio);
		const videoRef = localVideoRef.current;
		if (videoRef) {
			(videoRef.srcObject as MediaStream).getAudioTracks()[0].enabled = !audio;
		}
	};

	const AudioIcon = audio ? AudioOutlined : AudioMutedOutlined;
	const VideoIcon = video ? VideoCameraAddOutlined : VideoCameraOutlined;

	return (
		<Modal
			title={
				<AppHeader className={styles['video-header']}>
					<span>{group.group.name}</span>
					<div>
						<AudioIcon
							className={classnames(styles['video-control'], {
								[styles['video-control--disabled']]: !audio,
							})}
							onClick={onToggleAudio}
						/>
						<VideoIcon
							className={classnames(styles['video-control'], {
								[styles['video-control--disabled']]: !video,
							})}
							onClick={onToggleVideo}
						/>
					</div>
				</AppHeader>
			}
			closeIcon={null}
			open
			onCancel={onClose}
			className={styles.modal}>
			<video ref={localVideoRef} className={styles.video} />
		</Modal>
	);
};
