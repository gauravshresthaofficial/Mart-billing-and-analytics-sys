export const validateFormData = (formData) => {
  let isValid = true;
  const errors = {
    clientName: '',
    clientPhone: '',
    item: Array.from({ length: formData.items.length }, () => ''),
  };

  // Validation check for client name
  if (!formData.client.name.trim()) {
    errors.clientName = 'Please provide client name.';
    isValid = false;
  }

  // Validation check for client phone
  if (!formData.client.phone.trim()) {
    errors.clientPhone = 'Please provide client phone number.';
    isValid = false;
  }

  // Validate all fields in each item row
  formData.items.forEach((item, index) => {
    let anyFieldEmpty = (
      item.itemName.trim() === '' ||
      item.unitPrice.toString().trim() === '' ||
      item.quantity.toString().trim() === ''
    );

    if (item.itemName.trim() === '' &&
      item.unitPrice.toString().trim() === '' &&
      item.quantity.toString().trim() === '') {
      anyFieldEmpty = false;
    }

    // If any field is empty, mark it as error
    if (anyFieldEmpty) {
      errors.item[index] = 'Please provide all item details.';
      isValid = false;
    }
  });

  // Remove item rows where all fields are empty
  const nonEmptyItems = formData.items.filter((item) => (
    item.itemName.trim() !== '' ||
    item.unitPrice.toString().trim() !== '' ||
    item.quantity.toString().trim() !== ''
  ));

  // Check if at least one item is added
  if (nonEmptyItems.length === 0) {
    errors.item = Array.from({ length: formData.items.length }, () => '')
    errors.item[0] = 'Please add at least one item.';
    isValid = false;
  }

  // Check payment status
  if (formData.amountDue === 0 && formData.amountPaid >= formData.total) {
    formData.status = "Paid";
  } else if (formData.amountDue === 0 && formData.amountPaid > 0) {
    formData.status = "Partial Payment";
  } else if (formData.dueDate && new Date(formData.dueDate) < new Date()) {
    formData.status = "Overdue";
  } else {
    formData.status = "Due";
  }

  // Update form data with non-empty items
  const updatedFormData = { ...formData, items: nonEmptyItems };

  // Return validation result and errors
  return { isValid, errors, updatedFormData };
};


