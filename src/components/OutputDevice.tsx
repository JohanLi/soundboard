import React, { FunctionComponent, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { loadOutputDevices, changeOutputDevice } from '../action';
import { IState, IDevice } from '../types';
import styles from './outputdevice.css';

interface Props {
  selected: IDevice;
  nonSelected: IDevice[];
  loadOutputDevices: () => void;
  changeOutputDevice: (id: string) => void;
}

const OutputDevice: FunctionComponent<Props> = (props) => {
  const [dropdown, setDropdown] = useState(false);

  useEffect(() => {
    props.loadOutputDevices();

    return () => null;
  }, []);

  if (!props.selected) {
    return null;
  }

  const nonSelected = props.nonSelected.map(device => (
    <li
      onClick={() => props.changeOutputDevice(device.id)}
      key={device.id}
    >
      {device.label}
    </li>
  ));

  const dropdownClass = classNames({
    [styles.dropdown]: true,
    [styles.active]: dropdown,
  });

  return (
    <div className={styles.outputDevice} onClick={() => setDropdown(!dropdown)}>
      <div>
        Output:
      </div>
      <div className={styles.selected}>
        {props.selected.label}
        <ul className={dropdownClass}>
          {nonSelected}
        </ul>
      </div>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  selected: state.devices.find(device => device.id === state.activeDevice),
  nonSelected: state.devices.filter(device => device.id !== state.activeDevice),
});

export default connect(
  mapStateToProps,
  {
    loadOutputDevices,
    changeOutputDevice,
  },
)(OutputDevice);
