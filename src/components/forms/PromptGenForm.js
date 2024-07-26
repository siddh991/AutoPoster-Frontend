import React, { useState, useEffect } from 'react';
import { Button, Flex, TextField, TextAreaField, SelectField, View, Heading } from '@aws-amplify/ui-react';
import { useNavigate, useLocation } from 'react-router-dom';
import '@aws-amplify/ui-react/styles.css';
import { createUserDetails, updateUserDetails, checkUserDetails } from '../apis/getUserInfo';
import { Auth } from 'aws-amplify';

const PromptGenForm = () => {
  const [user, setUser] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [niche, setNiche] = useState('');
  const [location, setLocation] = useState('');
  const [uniqueSellingPoints, setUniqueSellingPoints] = useState([]);
  const [targetAudience, setTargetAudience] = useState('');
  const [captionTone, setCaptionTone] = useState('');
  const [captionFormatting, setCaptionFormatting] = useState('');
  const [otherIndustry, setOtherIndustry] = useState('');
  const [brandAssociation, setBrandAssociation] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (state && state.username) {
          setUser({ username: state.username, email: state.email });
        } else {
          const currentUser = await Auth.currentAuthenticatedUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        setError('Unable to load user information. Please try logging in again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [state]);


  useEffect(() => {
    const loadUserDetails = async () => {
      if (user && user.username) {
        try {
          const existingDetails = await checkUserDetails(user.username);
          if (existingDetails) {
            setCompanyName(existingDetails.companyName || '');
            setIndustry(existingDetails.industry || '');
            setNiche(existingDetails.niche || '');
            setLocation(existingDetails.location || '');
            setUniqueSellingPoints(existingDetails.uniqueSellingPoints?.filter(usp => usp.feature && usp.importance) || []);
            setTargetAudience(existingDetails.targetAudience || '');
            setCaptionTone(existingDetails.captionTone || '');
            setCaptionFormatting(existingDetails.captionFormatting || '');
            setBrandAssociation(existingDetails.brandAssociation || '');
          }
        } catch (error) {
          console.error('Error loading user details:', error);
          setError('Failed to load existing user details. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadUserDetails();
  }, [user]);


  const handleUSPChange = (index, field, value) => {
    const updatedUSPs = uniqueSellingPoints.map((usp, i) =>
      i === index ? { ...usp, [field]: value } : usp
    );
    setUniqueSellingPoints(updatedUSPs);
  };

  const addUSP = () => {
    setUniqueSellingPoints([...uniqueSellingPoints, { feature: '', importance: 3 }]);
  };

  const removeUSP = (index) => {
    setUniqueSellingPoints(uniqueSellingPoints.filter((_, i) => i !== index));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userDetails = {
        company_id: user.username,
        companyName,
        industry: industry === 'Other' ? otherIndustry : industry,
        niche,
        location,
        targetAudience,
        uniqueSellingPoints: uniqueSellingPoints.filter(usp => usp.feature.trim() !== '').map(usp => ({
          feature: usp.feature,
          importance: usp.importance,
          weight: usp.importance / 5
        })),
        captionTone,
        captionFormatting,
        brandAssociation,
      };

      console.log('Submitting user details:', JSON.stringify(userDetails, null, 2));

      const existingDetails = await checkUserDetails(user.username);
      if (existingDetails) {
        console.log('Updating existing details');
        const updateResponse = await updateUserDetails(userDetails);
        console.log('Update response:', updateResponse);
      } else {
        console.log('Creating new details');
        const createResponse = await createUserDetails(userDetails);
        console.log('Create response:', createResponse);
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving user details:', error);
      setError('An error occurred while saving your details. Please try again.');
    }
  };






  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <View padding="20px">
        <Heading level={3} color="red">{error}</Heading>
        <Button onClick={() => navigate('/login')}>Return to Login</Button>
      </View>
    );
  }


  return (
    <View as="form" onSubmit={handleSubmit} padding="20px" maxWidth="600px" margin="0 auto">
      <Heading level={3} marginBottom="20px">
        {companyName ? 'Update Your Profile' : 'Complete Your Profile'}
      </Heading>
      <Heading level={6} style={{ fontWeight: 'bold' }} marginBottom="5px">Company Name</Heading>
      <TextField
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        placeholder="Enter your company name"
        required
        marginBottom="15px"
      />

      <Heading level={6} style={{ fontWeight: 'bold' }} marginBottom="5px">Industry</Heading>
      <SelectField
        value={industry}
        onChange={(e) => setIndustry(e.target.value)}
        placeholder="Select industry"
        required
        marginBottom="15px"
      >
        <option value="Barbershop">Barbershop</option>
        <option value="Café">Café</option>
        <option value="Tech Startup">Tech Startup</option>
        <option value="Gift Shop">Gift Shop</option>
        <option value="Restaurant">Gift Shop</option>
        <option value="Other">Other</option>
      </SelectField>
      {industry === 'Other' && (
        <TextField
          label="Specify Your Industry"
          value={otherIndustry}
          onChange={(e) => setOtherIndustry(e.target.value)}
          placeholder="Enter your industry"
          required
          marginBottom="15px"
        />
      )}
      <Heading level={6} style={{ fontWeight: 'bold' }} marginBottom="5px">Niche</Heading>
      <TextField
        value={niche}
        onChange={(e) => setNiche(e.target.value)}
        placeholder="e.g., young men's haircuts"
        required
        marginBottom="15px"
      />
      <Heading level={6} style={{ fontWeight: 'bold' }} marginBottom="5px">Location</Heading>
      <TextField
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="e.g., San Francisco, California"
        required
        marginBottom="15px"
      />
      <Heading level={6} style={{ fontWeight: 'bold' }} marginBottom="5px">Target Audience</Heading>
      <TextField
        value={targetAudience}
        onChange={(e) => setTargetAudience(e.target.value)}
        placeholder="women in their 20s"
        required
        marginBottom="15px"
      />

      <View marginBottom="15px">
        <Heading level={6} style={{ fontWeight: 'bold' }}>Points of Emphasis for Caption</Heading>
        {uniqueSellingPoints.map((usp, index) => (
          <View key={index} marginBottom="15px">
            <TextField
              value={usp.feature}
              onChange={(e) => handleUSPChange(index, 'feature', e.target.value)}
              placeholder="Enter point of emphasis"
              required
            />
            <Flex alignItems="center">
              <label htmlFor={`importance-${index}`} style={{ marginRight: '10px' }}>Importance</label>
              <input
                type="range"
                id={`importance-${index}`}
                min="1"
                max="5"
                value={usp.importance}
                onChange={(e) => handleUSPChange(index, 'importance', parseInt(e.target.value))}
                style={{ marginLeft: "10px", flex: 1 }}
              />
              <span>{usp.importance}</span>
            </Flex>
            <Button type="button" onClick={() => removeUSP(index)}>Remove</Button>
          </View>
        ))}
        <Button type="button" onClick={addUSP} marginBottom="15px">Add Another Point</Button>
      </View>

      <Heading level={6} style={{ fontWeight: 'bold' }} marginBottom="5px">Caption Tone</Heading>
      <TextField
        value={captionTone}
        onChange={(e) => setCaptionTone(e.target.value)}
        placeholder="e.g., Exciting, Friendly, Professional"
        required
        marginBottom="15px"
      />

      <Heading level={6} style={{ fontWeight: 'bold' }} marginBottom="5px">When customers think of your brand, you would want them to think ...</Heading>
      <TextField
        value={brandAssociation}
        onChange={(e) => setBrandAssociation(e.target.value)}
        placeholder="Enter the feeling(s) or association(s) you want for your brand"
        required
        marginBottom="15px"
      />

      <Heading level={6} style={{ fontWeight: 'bold' }} marginBottom="5px">Formatting of Caption</Heading>
      <TextAreaField
        value={captionFormatting}
        onChange={(e) => setCaptionFormatting(e.target.value)}
        placeholder={`Caption #companyName\n.\n.\n.\nhashtags`}
        required
        marginBottom="20px"
        rows="5"
        style={{ textAlign: 'left' }}
      />

      <Button type="submit" variation="primary" width="100%">
        {companyName ? 'Update Details' : 'Save Details'}
      </Button>
    </View>
  );
};

export default PromptGenForm;
