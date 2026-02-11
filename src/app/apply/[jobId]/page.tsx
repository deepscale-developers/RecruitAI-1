"use client";

import { useState, useEffect } from "react";
import { Button, Input, Card, CardBody, CardHeader } from "@/components";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  cv: File | null;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
}

interface JobInfo {
  title: string;
  company: string;
  department: string;
  location: string;
  requirements: string;
  question1?: string;
  question2?: string;
  question3?: string;
  question4?: string;
  applicationCloseDate: string;
  applicationCloseTime: string;
}

export default function PublicApplicationFormPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [jobInfo, setJobInfo] = useState<JobInfo>({
    title: "Senior Frontend Developer",
    company: "Acme Corporation",
    department: "Engineering",
    location: "San Francisco, CA",
    requirements: "5+ years React experience, TypeScript, strong communication skills",
    question1: "What's your experience with React and state management?",
    question2: "Describe your experience leading a project from design to deployment",
    question3: "How do you approach testing in your frontend projects?",
    question4: "Tell us about your experience with TypeScript",
    applicationCloseDate: "2026-12-31",
    applicationCloseTime: "23:59",
  });
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    cv: null,
    answer1: "",
    answer2: "",
    answer3: "",
    answer4: "",
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});

  // Validation functions
  const validateFullName = (name: string): string => {
    if (!name.trim()) return "Full name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    if (/[0-9]/.test(name)) return "Name cannot contain numbers";
    return "";
  };

  const validateEmail = (email: string): string => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email";
    return "";
  };

  const validatePhone = (phone: string): string => {
    if (!phone.trim()) return "Phone number is required";
    const phoneRegex = /^[\d\s\-\+\(\)]+$/.test(phone) && phone.replace(/\D/g, "").length >= 10;
    if (!phoneRegex) return "Please enter a valid phone number";
    return "";
  };

  const validateCV = (cv: File | null): string => {
    if (!cv) return "CV/Resume is required";
    const validExtensions = [".pdf", ".doc", ".docx"];
    const fileExtension = "." + cv.name.split(".").pop()?.toLowerCase();
    if (!validExtensions.includes(fileExtension)) return "Only PDF, DOC, DOCX allowed";
    if (cv.size > 10 * 1024 * 1024) return "File size must be less than 10MB";
    return "";
  };

  const isFieldValid = (fieldName: string): boolean => {
    if (fieldName === "fullName") return !validateFullName(formData.fullName);
    if (fieldName === "email") return !validateEmail(formData.email);
    if (fieldName === "phone") return !validatePhone(formData.phone);
    if (fieldName === "cv") return !validateCV(formData.cv);
    return false;
  };

  const validateStep1 = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    newErrors.fullName = validateFullName(formData.fullName);
    newErrors.email = validateEmail(formData.email);
    newErrors.phone = validatePhone(formData.phone);
    newErrors.cv = validateCV(formData.cv);
    setErrors(newErrors);
    setTouched({ fullName: true, email: true, phone: true, cv: true });
    return !Object.values(newErrors).some(err => err !== "");
  };

  const validateStep2 = (): boolean => {
    if (!formData.answer1 && jobInfo.question1) return false;
    if (!formData.answer2 && jobInfo.question2) return false;
    if (!formData.answer3 && jobInfo.question3) return false;
    if (!formData.answer4 && jobInfo.question4) return false;
    return true;
  };

  // Check if application is still open
  useEffect(() => {
    const checkIfClosed = () => {
      if (jobInfo.applicationCloseDate && jobInfo.applicationCloseTime) {
        const closeDateTime = new Date(`${jobInfo.applicationCloseDate}T${jobInfo.applicationCloseTime}`);
        const now = new Date();
        if (now > closeDateTime) {
          setIsClosed(true);
        }
      }
      setIsLoading(false);
    };

    // Simulate fetching job info
    setTimeout(() => {
      checkIfClosed();
    }, 500);
  }, [jobInfo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Validate on change if field has been touched
    if (touched[name]) {
      let error = "";
      if (name === "fullName") error = validateFullName(value);
      else if (name === "email") error = validateEmail(value);
      else if (name === "phone") error = validatePhone(value);
      
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleFieldBlur = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    let error = "";
    if (fieldName === "fullName") error = validateFullName(formData.fullName);
    else if (fieldName === "email") error = validateEmail(formData.email);
    else if (fieldName === "phone") error = validatePhone(formData.phone);
    setErrors((prev) => ({ ...prev, [fieldName]: error }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, cv: file }));
      setTouched((prev) => ({ ...prev, cv: true }));
      const error = validateCV(file);
      setErrors((prev) => ({ ...prev, cv: error }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) {
      alert("Please answer all questions");
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center px-4 py-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (isClosed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md text-center">
          <Card>
            <CardBody className="py-12">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Application Closed
              </h1>
              <p className="text-gray-600 mb-6">
                Unfortunately, the application period for the <span className="font-semibold">{jobInfo.title}</span> position has ended. The deadline was {new Date(`${jobInfo.applicationCloseDate}T${jobInfo.applicationCloseTime}`).toLocaleDateString()} at {new Date(`${jobInfo.applicationCloseDate}T${jobInfo.applicationCloseTime}`).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Please reach out to the recruiter at <span className="font-semibold">careers@acmecorp.com</span> for more information about this position or similar opportunities.
              </p>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">Tip:</span> Check back later for other open positions or contact the recruiting team for guidance.
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md text-center">
          <Card>
            <CardBody className="py-12">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-green-600">✓</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Application Submitted!
              </h1>
              <p className="text-gray-600 mb-6">
                Thank you for applying to the {jobInfo.title} position. Our team will review your application and get back to you within 3-5 business days.
              </p>
              <p className="text-sm text-gray-500">
                A confirmation email has been sent to {formData.email}
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
              {jobInfo.company.charAt(0)}
            </div>
            <span className="text-2xl font-bold text-gray-900">{jobInfo.company}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {jobInfo.title}
          </h1>
          <p className="text-gray-600 mt-1">{jobInfo.department} • {jobInfo.location}</p>
        </div>

        {/* Application Deadline */}
        {jobInfo.applicationCloseDate && jobInfo.applicationCloseTime && (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardBody>
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Application Deadline:</span> {new Date(`${jobInfo.applicationCloseDate}T${jobInfo.applicationCloseTime}`).toLocaleDateString()} at {new Date(`${jobInfo.applicationCloseDate}T${jobInfo.applicationCloseTime}`).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </CardBody>
          </Card>
        )}

        {/* Progress Indicator */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1">
              <div
                className={`h-2 rounded-full transition-colors ${
                  step >= s ? "bg-primary" : "bg-gray-200"
                }`}
              ></div>
              <p className="text-xs text-gray-600 mt-1">
                {s === 1 ? "Personal Info" : s === 2 ? "Questions" : "Review"}
              </p>
            </div>
          ))}
        </div>

        {/* Form */}
        <Card>
          <CardBody className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Your Information</h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        placeholder="Full Name"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        onBlur={() => handleFieldBlur("fullName")}
                        className={errors.fullName && touched.fullName ? "border-red-500" : ""}
                      />
                      {isFieldValid("fullName") && touched.fullName && (
                        <div className="absolute right-3 top-3 text-green-500">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {errors.fullName && touched.fullName && (
                      <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        placeholder="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={() => handleFieldBlur("email")}
                        className={errors.email && touched.email ? "border-red-500" : ""}
                      />
                      {isFieldValid("email") && touched.email && (
                        <div className="absolute right-3 top-3 text-green-500">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {errors.email && touched.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        placeholder="Phone Number"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        onBlur={() => handleFieldBlur("phone")}
                        className={errors.phone && touched.phone ? "border-red-500" : ""}
                      />
                      {isFieldValid("phone") && touched.phone && (
                        <div className="absolute right-3 top-3 text-green-500">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {errors.phone && touched.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload CV / Resume <span className="text-red-500">*</span>
                    </label>
                    <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                      errors.cv && touched.cv ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                    }`}>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                        id="cv-upload"
                      />
                      <label
                        htmlFor="cv-upload"
                        className="cursor-pointer block"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <p className="text-gray-600 font-medium">
                            {formData.cv ? formData.cv.name : "Drop your CV here or click to browse"}
                          </p>
                          {isFieldValid("cv") && touched.cv && (
                            <div className="text-green-500">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">PDF, DOC, or DOCX up to 10MB</p>
                      </label>
                    </div>
                    {errors.cv && touched.cv && (
                      <p className="text-red-500 text-sm mt-1">{errors.cv}</p>
                    )}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Screening Questions</h2>

                  {jobInfo.question1 && (
                    <div>
                      <label className="label">
                        {jobInfo.question1}
                      </label>
                      <textarea
                        name="answer1"
                        value={formData.answer1}
                        onChange={handleInputChange}
                        placeholder="Your answer..."
                        className="input resize-vertical min-h-28"
                        required
                      />
                    </div>
                  )}

                  {jobInfo.question2 && (
                    <div>
                      <label className="label">
                        {jobInfo.question2}
                      </label>
                      <textarea
                        name="answer2"
                        value={formData.answer2}
                        onChange={handleInputChange}
                        placeholder="Your answer..."
                        className="input resize-vertical min-h-28"
                        required
                      />
                    </div>
                  )}

                  {jobInfo.question3 && (
                    <div>
                      <label className="label">
                        {jobInfo.question3}
                      </label>
                      <textarea
                        name="answer3"
                        value={formData.answer3}
                        onChange={handleInputChange}
                        placeholder="Your answer..."
                        className="input resize-vertical min-h-28"
                        required
                      />
                    </div>
                  )}

                  {jobInfo.question4 && (
                    <div>
                      <label className="label">
                        {jobInfo.question4}
                      </label>
                      <textarea
                        name="answer4"
                        value={formData.answer4}
                        onChange={handleInputChange}
                        placeholder="Your answer..."
                        className="input resize-vertical min-h-28"
                        required
                      />
                    </div>
                  )}

                  {!jobInfo.question1 && !jobInfo.question2 && !jobInfo.question3 && !jobInfo.question4 && (
                    <p className="text-gray-500 italic">No custom screening questions added for this position.</p>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Review Your Application</h2>

                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Full Name</p>
                      <p className="font-medium text-gray-900">{formData.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{formData.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">{formData.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">CV</p>
                      <p className="font-medium text-gray-900">{formData.cv?.name}</p>
                    </div>
                  </div>

                  {(jobInfo.question1 || jobInfo.question2 || jobInfo.question3 || jobInfo.question4) && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Screening Answers</h3>
                      <div className="space-y-4">
                        {jobInfo.question1 && (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 font-medium mb-2">{jobInfo.question1}</p>
                            <p className="text-gray-900 whitespace-pre-wrap">{formData.answer1}</p>
                          </div>
                        )}
                        {jobInfo.question2 && (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 font-medium mb-2">{jobInfo.question2}</p>
                            <p className="text-gray-900 whitespace-pre-wrap">{formData.answer2}</p>
                          </div>
                        )}
                        {jobInfo.question3 && (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 font-medium mb-2">{jobInfo.question3}</p>
                            <p className="text-gray-900 whitespace-pre-wrap">{formData.answer3}</p>
                          </div>
                        )}
                        {jobInfo.question4 && (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 font-medium mb-2">{jobInfo.question4}</p>
                            <p className="text-gray-900 whitespace-pre-wrap">{formData.answer4}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">
                      <span className="font-semibold">Privacy Notice:</span> Your application will be evaluated using AI screening technology. Your data will be handled securely according to our privacy policy.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setStep(step - 1)}
                  >
                    Back
                  </Button>
                )}
                {step < 3 ? (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => {
                      if (step === 1) {
                        if (validateStep1()) {
                          setStep(step + 1);
                        }
                      } else {
                        setStep(step + 1);
                      }
                    }}
                    className="ml-auto"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSubmitting}
                    className="ml-auto"
                  >
                    Submit Application
                  </Button>
                )}
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
