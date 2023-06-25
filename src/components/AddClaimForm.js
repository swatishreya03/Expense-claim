import React, { useState, useEffect } from 'react';
import Topbar from './Topbar';
import Axios from 'axios';
import { useNavigate } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';

const AddClaimForm = () => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [invoice, setInvoice] = useState(null);
  const [mail, setMail] = useState(null);
  const [showOtherCategory, setShowOtherCategory] = useState(false);
  const [otherCategory, setOtherCategory] = useState('');
  const [travelDetails, setTravelDetails] = useState({
    travelType: '',
    withinCity: {
      onboardingLocation: '',
      destinationLocation: '',
      distance: '',
    },
  });
  const [empID, setEmpID] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      Axios.get('http://localhost:3001/auth/', {
        headers: {
          authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          if (data.status === 410) {
            localStorage.removeItem('token');
            navigate('/');
          }
          else if (data.status === 200) {
            setEmpID(data.id);
          }
        }).catch((error) => {
          console.log(error);
        });
    }
    else {
      navigate('/');
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(invoice);

    const formData = new FormData();
    formData.append('category', category);
    formData.append('claimAmount', amount);
    formData.append('invoice', invoice);
    formData.append('mail', mail);
    formData.append('otherCategory', otherCategory);
    formData.append('travel', travelDetails);
    formData.append('employeeID', empID);

    await Axios.post('http://localhost:3001/claim/add-claim', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    })
      .then(({ data }) => {
        if (data.status === 200) {
          toast.success('Claim Rejected Successfully!', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          resetForm();
        }
      }).catch((error) => {
        console.log(error);
      });
  };

  const resetForm = () => {
    setCategory('');
    setAmount('');
    setInvoice(null);
    setMail(null);
    setShowOtherCategory(false);
    setOtherCategory('');
    setTravelDetails({
      travelType: '',
      withinCity: {
        onboardingLocation: '',
        destinationLocation: '',
        distance: '',
      },
    });
  };

  const handleCategoryChange = event => {
    const selectedCategory = event.target.value;
    setCategory(selectedCategory);
    if (selectedCategory === 'others') {
      setShowOtherCategory(true);
    } else {
      setShowOtherCategory(false);
      setOtherCategory('');
    }
  };

  useEffect(() => {
    // Calculate the distance when the onboarding or destination location changes
    const calculateDistance = async () => {
      const { onboardingLocation, destinationLocation } = travelDetails.withinCity;
      if (onboardingLocation && destinationLocation) {
        try {
          //const response = await fetch(
          const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${(onboardingLocation)}&destinations=${(destinationLocation)}&key=mKxIvt88UJY8E6x8sY6m1BllBEL17Ies`;
          const response = await fetch(url);

          const data = await response.json();
          console.log('Response Data:', data);
          const distanceValue = data.rows[0].elements[0].distance.text;
          setTravelDetails((prevTravelDetails) => ({
            ...prevTravelDetails,
            withinCity: {
              ...prevTravelDetails.withinCity,
              distance: distanceValue,
            },
          }));
        } catch (error) {
          console.log('Error calculating distance:', error);
          setTravelDetails(prevTravelDetails => ({
            ...prevTravelDetails,
            withinCity: {
              ...prevTravelDetails.withinCity,
              distance: 'Error calculating distance',
            },
          }));
        }
      } else {
        setTravelDetails(prevTravelDetails => ({
          ...prevTravelDetails,
          withinCity: {
            ...prevTravelDetails.withinCity,
            distance: '',
          },
        }));
      }
    };

    calculateDistance();
  }, [travelDetails.withinCity.onboardingLocation, travelDetails.withinCity.destinationLocation]);

  const { distance: travelDistance } = travelDetails.withinCity;
  return (
    <>
      <Topbar name="EDUDIGM" />
      <div className='claim-outer'>
        <div className="add-claim-form">
          <h1>Add New Claim</h1>
          <form onSubmit={handleSubmit}>
            <label>
              Category:
              <select
                value={category}
                onChange={handleCategoryChange}
                required
              >
                <option value="" disabled>Select Category</option>
                <option value="travel">Travel</option>
                <option value="food">Food</option>
                <option value="stay">Stay</option>
                <option value="office">Office Expense</option>
                <option value="others">Others</option>
              </select>
            </label>
            {category === 'travel' && (
              <>
                <label>
                  Travel Type:
                  <select
                    value={travelDetails.travelType}
                    onChange={(event) =>
                      setTravelDetails({
                        ...travelDetails,
                        travelType: event.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select Travel Type</option>
                    <option value="withinCity">Within City</option>
                    <option value="outsideCity">Outside City</option>
                  </select>
                </label>
                {travelDetails.travelType === 'withinCity' && (
                  <>
                    <label>
                      Onboarding Location:
                      <input
                        type="text"
                        value={travelDetails.withinCity.onboardingLocation}
                        onChange={(event) =>
                          setTravelDetails({
                            ...travelDetails,
                            withinCity: {
                              ...travelDetails.withinCity,
                              onboardingLocation: event.target.value,
                            },
                          })
                        }
                        required
                      />
                    </label>
                    <label>
                      Destination Location:
                      <input
                        type="text"
                        value={travelDetails.withinCity.destinationLocation}
                        onChange={(event) =>
                          setTravelDetails({
                            ...travelDetails,
                            withinCity: {
                              ...travelDetails.withinCity,
                              destinationLocation: event.target.value,
                            },
                          })
                        }
                        required
                      />
                    </label>
                    <p>Distance: {travelDistance ? `${travelDistance} km` : ''}</p>
                  </>
                )}
              </>
            )}

            {showOtherCategory && (
              <label>
                Other Category:
                <input
                  type="text"
                  value={otherCategory}
                  onChange={event => setOtherCategory(event.target.value)}
                  required
                />
              </label>
            )}
            <label>
              Amount:
              <input
                type="number"
                value={amount}
                onChange={event => setAmount(event.target.value)}
                required
              />
            </label>
            <label>
              Invoice:
              <input
                type="file"
                accept=".jpg, .png, .pdf, .jpeg"
                onChange={event => setInvoice(event.target.files[0])}
                required
              />
            </label>
            <label>
              Mail:
              <input
                type="file"
                accept=" .pdf"
                onChange={event => setMail(event.target.files[0])}
                required
              />
            </label>
            <button type="submit">Submit Claim</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddClaimForm;
