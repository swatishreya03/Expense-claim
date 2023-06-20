import React, { useState, useEffect } from 'react';

const AddClaimForm = () => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [invoice, setInvoice] = useState('');
  const [Mail, setMail] = useState('');
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

  const [distance, setDistance] = useState('');
  //const history = useHistory();


  const handleSubmit = event => {
    event.preventDefault();
    const obj = {
      "Category": category,
      "Amount": amount,
      "Invoice": invoice,
      "Mail": Mail,
      "TravelDetails": travelDetails
    }
    localStorage.setItem('from_data', JSON.stringify(obj));
    console.log(obj);
    // Handle claim form submission here
    // You can access the category, amount, and invoice values from the component's state (category, amount, invoice)
    // console.log('Claim Form Submitted');
    // console.log('Category:', category);
    // console.log('Amount:', amount);
    // console.log('Invoice:', invoice);
    // console.log('Mail:', Mail);

    // Reset the form
    // setClaims(prevClaims => [...prevClaims, newClaim]);

    setCategory('');
    setAmount('');
    setInvoice('');
    setMail('');
    setShowOtherCategory(false);
    setOtherCategory('');
    setTravelDetails({
      travelType: '',
      withinCity: {
        onboardingLocation: '',
        destinationLocation: '',
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
          setTravelDetails(prevTravelDetails => ({
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
              <option value="">Select Category</option>
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
              accept=".jpg, .png, .pdf"
              onChange={event => setInvoice(event.target.value)}
              required
            />
          </label>
          <label>
            Mail:
            <input
              type="file"
              accept=" .pdf"
              onChange={event => setMail(event.target.value)}
              required
            />
          </label>
          <button type="submit">Submit Claim</button>
        </form>
      </div>
    </div>
  );
};

export default AddClaimForm;
