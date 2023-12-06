import React, { useState } from 'react';

const Settings = () => {
  const [locationAccess, setLocationAccess] = useState(false);
  const [appNotifications, setAppNotifications] = useState(false);

  return (
    <div>
      <h2>Settings</h2>
      <div>
        <label>
          <input
            type="checkbox"
            checked={locationAccess}
            onChange={() => setLocationAccess(!locationAccess)}
          />
          Enable Location Access
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={appNotifications}
            onChange={() => setAppNotifications(!appNotifications)}
          />
          Enable App Notifications
        </label>
      </div>
    </div>
  );
};

export default Settings;
