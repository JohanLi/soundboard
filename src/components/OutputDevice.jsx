import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { loadOutputDevices, changeOutputDevice } from '../actions';
import styles from './outputdevice.css';

const OutputDevice = (props) => {
  const [dropdown, setDropdown] = useState(false);

  useEffect(() => {
    props.loadOutputDevices();

    return () => null;
  }, []);

  if (props.devices.length === 0) {
    return null;
  }

  const selected = props.devices.find(device => device.id === props.activeDevice);

  const others = props.devices.filter(device => device.id !== props.activeDevice);

  const devices = others.map(device => (
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
        {selected.label}
        <ul className={dropdownClass}>
          {devices}
        </ul>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  devices: state.devices,
  activeDevice: state.activeDevice,
});

export default connect(
  mapStateToProps,
  {
    loadOutputDevices,
    changeOutputDevice,
  },
)(OutputDevice);
