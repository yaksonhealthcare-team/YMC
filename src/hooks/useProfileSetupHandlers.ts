import { useState } from 'react';
import { Address } from 'react-daum-postcode/lib/loadPostcode';
import { UserSignup } from '../types/User';
import { useSignup } from '../contexts/SignupContext';

export const useProfileSetupHandlers = () => {
  const { signupData, setSignupData } = useSignup();
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setSignupData((prev) => ({
        ...prev,
        profileUrl: imageUrl
      }));
    }
  };

  const handleImageDelete = () => {
    setSignupData((prev) => ({
      ...prev,
      profileUrl: undefined
    }));
  };

  const handleCompletePostcode = (address: Address) => {
    setSignupData({
      ...signupData,
      postCode: address.zonecode,
      address1: address.address
    });
    setIsPostcodeOpen(false);
  };

  const toggleBrandSelection = (code: string) => {
    setSignupData((prev: UserSignup) => {
      const brandCodes = prev.brandCodes || [];
      const isSelected = brandCodes.includes(code);

      const updatedBrands = isSelected ? brandCodes.filter((brandCode) => brandCode !== code) : [...brandCodes, code];

      return { ...prev, brandCodes: updatedBrands };
    });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setSignupData({ ...signupData, name: newName });
  };

  return {
    isPostcodeOpen,
    setIsPostcodeOpen,
    handleImageUpload,
    handleImageDelete,
    handleCompletePostcode,
    toggleBrandSelection,
    handleNameChange
  };
};
