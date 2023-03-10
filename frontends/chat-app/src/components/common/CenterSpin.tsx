import { Spin } from 'antd';
import { SpinProps } from 'antd/es/spin';
import styles from './CenterSpin.module.css';

export function CenterSpin(props: SpinProps) {
	return (
		<div className={styles['spin-container']}>
			<Spin {...props} />
		</div>
	);
}
