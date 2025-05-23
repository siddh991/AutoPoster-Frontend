import React from 'react';
import { StorageManager } from '@aws-amplify/ui-react-storage';
import { UploadSectionProps } from '../../types/props';

/**
 * UploadSection component for handling file uploads
 * Uses AWS Amplify's StorageManager for file management
 */
const UploadSection: React.FC<UploadSectionProps> = ({ user, processFile }) => (
  <div>
    <h3 style={{ textAlign: 'left' }}>Upload Photos:</h3>
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
