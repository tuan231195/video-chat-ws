import { User } from 'src/types/user';
import { useEffect, useRef, useState } from 'react';
import { Typography } from 'antd';
import styles from './UserVideo.module.css';

const { Title } = Typography;

export const UserVideo = ({
	audio = true,
	video = true,
	stream,
	user,
}: {
	user: User;
	stream: MediaStream | null;
	audio?: boolean;
	video?: boolean;
}) => {
	const localVideoRef = useRef<HTMLVideoElement>(null);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		const videoRef = localVideoRef.current;
		if (videoRef && stream) {
			videoRef.srcObject = stream;
			videoRef.addEventListener('loadedmetadata', async () => {
				await videoRef.play();
				setLoaded(true);
			});
		}
	}, [stream]);

	useEffect(() => {
		const videoRef = localVideoRef.current;
		if (videoRef) {
			(videoRef.srcObject as MediaStream).getVideoTracks()[0].enabled = video;
			(videoRef.srcObject as MediaStream).getAudioTracks()[0].enabled = audio;
		}
	}, [loaded, video, audio, localVideoRef.current]);

	return stream ? (
		<div className={styles['video-container']}>
			<Title level={5} className={styles['video-name']}>
				{user.name}
			</Title>
			<video ref={localVideoRef} className={styles.video} />
		</div>
	) : null;
};
