import * as React from 'react';
import styles from './DemoWorld1.module.scss';
import { IDemoWorld1Props } from './IDemoWorld1Props';
import { IconButton } from 'office-ui-fabric-react/lib/Button';

export const DemoWorld1: React.FunctionComponent<IDemoWorld1Props> = (props) => {
  const [isLikedByMe, setIsLikedByMe] = React.useState(false);

  function _onClickThumb() {

    setIsLikedByMe(!isLikedByMe);
  }


  return (
    <div className={styles.demoWorld1}>
      <div className={styles.container}>
        <div>This button</div>
        <IconButton iconProps={{ iconName: isLikedByMe ? 'LikeSolid' : 'Like' }} title='Like' onClick={_onClickThumb} />
      </div>
    </div>
  );


};

