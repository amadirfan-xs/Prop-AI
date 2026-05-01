import * as Yup from "yup";
import { PropertyFormValues } from "@/types/properties";

export const propertyInitialValues: PropertyFormValues = {
  title: "",
  description: "",
  type: "Residential Apartment",
  price: "",
  beds: "",
  baths: "",
  sqft: "",
  address: "",
  city: "",
  zipCode: "",
  listingHighlights: "",
  files: [],
};

export const propertySchema = Yup.object().shape({
  title: Yup.string().required("Title is required").max(100, "Title too long"),
  description: Yup.string()
    .required("Description is required")
    .max(15000, "Character limit exceeded"),
  type: Yup.string().required("Property type is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .required("Price is required")
    .positive("Price must be positive"),
  beds: Yup.number().typeError("Beds must be a number").required("Required"),
  baths: Yup.number().typeError("Baths must be a number").required("Required"),
  sqft: Yup.number().typeError("Sqft must be a number").required("Required"),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  zipCode: Yup.string().required("Zip is required"),
  files: Yup.array().min(1, "At least one image is required"),
});
