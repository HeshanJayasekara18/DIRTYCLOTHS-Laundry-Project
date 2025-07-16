// src/service/SelectedServiceSummary.jsx
import { Check, Star, Package, Weight, Calendar, Clock, CreditCard } from 'lucide-react';

const SelectedServiceSummary = (props) => {
  // Safely destructure props with default values
  const {
    selectedService,
    formData = {},
    addOnOptions = [],
    getPackageColor,
    getPackageIcon,
    formatProcessingTime,
    processFeatures,
    calculateTotal,
  } = props;

  if (!selectedService) return null;

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Summary</h3>

        {/* Selected Service Package */}
        <div className="mb-6">
          <div className={`${getPackageColor(selectedService.packageName)} h-1 w-full rounded-full mb-3`}></div>
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
              {getPackageIcon(selectedService.packageName)}
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">{selectedService.packageName}</h4>
              <p className="text-sm text-gray-600">{formatProcessingTime(selectedService.processingTime)}</p>
            </div>
          </div>

          {/* Package Description */}
          <p className="text-gray-600 text-sm mb-3">{selectedService.description}</p>

          {/* Package Features */}
          <div className="space-y-2 mb-4">
            {processFeatures(selectedService.features).slice(0, 4).map((feature, index) => (
              <div key={index} className="flex items-center text-sm">
                <Check size={14} className="text-green-500 mr-2 flex-shrink-0" />
                <span className="text-gray-600">{feature}</span>
              </div>
            ))}
          </div>

          {/* Package Rating */}
          <div className="flex items-center mb-4">
            <div className="flex mr-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={14}
                  fill={star <= selectedService.rating ? '#FFDD00' : '#E5E7EB'}
                  color={star <= selectedService.rating ? '#FFDD00' : '#E5E7EB'}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {selectedService.rating} ({selectedService.reviews} reviews)
            </span>
          </div>

          {/* Package Pricing Info */}
          <div className="bg-blue-50 p-3 rounded-lg mb-4">
            <h5 className="font-medium text-blue-800 mb-2">Package Pricing</h5>
            <div className="space-y-1">
              {selectedService.weightPricing.map((tier, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-blue-700">{tier.weight}:</span>
                  <span className="font-medium text-blue-800">{tier.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="border-t border-gray-200 pt-4 mb-4">
          <h4 className="font-medium text-gray-800 mb-3 flex items-center">
            <Package size={16} className="mr-2 text-blue-600" />
            Order Details
          </h4>
          <div className="space-y-2 text-sm">
            {formData.weight && (
              <div className="flex justify-between">
                <span className="text-gray-600 flex items-center">
                  <Weight size={14} className="mr-1" />
                  Weight:
                </span>
                <span className="font-medium">{formData.weight} kg</span>
              </div>
            )}
            {formData.preferredDate && (
              <div className="flex justify-between">
                <span className="text-gray-600 flex items-center">
                  <Calendar size={14} className="mr-1" />
                  Date:
                </span>
                <span className="font-medium">
                  {new Date(formData.preferredDate).toLocaleDateString()}
                </span>
              </div>
            )}
            {formData.preferredTime && (
              <div className="flex justify-between">
                <span className="text-gray-600 flex items-center">
                  <Clock size={14} className="mr-1" />
                  Time:
                </span>
                <span className="font-medium">{formData.preferredTime}</span>
              </div>
            )}
            {formData.paymentMethod && (
              <div className="flex justify-between">
                <span className="text-gray-600 flex items-center">
                  <CreditCard size={14} className="mr-1" />
                  Payment:
                </span>
                <span className="font-medium capitalize">{formData.paymentMethod}</span>
              </div>
            )}
          </div>
        </div>

        {/* Selected Add-ons */}
        {formData.addOns?.length > 0 && (
          <div className="border-t border-gray-200 pt-4 mb-4">
            <h4 className="font-medium text-gray-800 mb-3">Selected Add-ons</h4>
            <div className="space-y-2">
              {formData.addOns.map((addOnId) => {
                const addOn = addOnOptions.find((option) => option.id === addOnId);
                return addOn ? (
                  <div key={addOnId} className="flex justify-between items-center text-sm">
                    <div>
                      <span className="font-medium text-gray-800">{addOn.name}</span>
                      <p className="text-gray-500 text-xs">{addOn.description}</p>
                    </div>
                    <span className="font-medium text-blue-600">+Rs {addOn.price}</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* Price Breakdown */}
        <div className="border-t border-gray-200 pt-4 mb-4">
          <h4 className="font-medium text-gray-800 mb-3">Price Breakdown</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Service charge:</span>
              <span className="font-medium">
                Rs{' '}
                {formData.weight
                  ? (
                      calculateTotal() -
                      (formData.addOns?.reduce((total, addOnId) => {
                        const addOn = addOnOptions.find((option) => option.id === addOnId);
                        return total + (addOn ? addOn.price : 0);
                      }, 0) || 0)
                    ).toFixed(2)
                  : '0.00'}
              </span>
            </div>
            {formData.addOns?.length > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Add-ons:</span>
                <span className="font-medium">
                  Rs{' '}
                  {(formData.addOns?.reduce((total, addOnId) => {
                    const addOn = addOnOptions.find((option) => option.id === addOnId);
                    return total + (addOn ? addOn.price : 0);
                  }, 0) || 0).toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <span className="text-lg font-semibold text-gray-800">Total Amount</span>
          <span className="text-xl font-bold text-blue-600">Rs {calculateTotal().toFixed(2)}</span>
        </div>

        {/* Estimated Delivery */}
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <div className="flex items-center text-green-800">
            <Clock size={16} className="mr-2" />
            <span className="font-medium">Estimated Delivery:</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            {formData.preferredDate
              ? new Date(new Date(formData.preferredDate).getTime() + 24 * 60 * 60 * 1000).toLocaleDateString()
              : 'Select date to see estimate'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SelectedServiceSummary;