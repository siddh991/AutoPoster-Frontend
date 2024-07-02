import React from 'react';
import { StorageManager } from '@aws-amplify/ui-react-storage';

const UploadSection = ({ user, processFile }) => (
  <div>
    <h3 align="left">Upload Photos:</h3>
    <StorageManager
      acceptedFileTypes={['.jpeg', '.jpg', '.png']}
      accessLevel="public"
      autoUpload={false}
      maxFileCount={30}
      processFile={(file) => processFile({ file, user })}
    />
  </div>
);

export default UploadSection;
