import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import DeleteAdvisor from '@/components/advisor/DeleteAdvisor';
import EditAdvisor from "@/components/advisor/EditAdvisor";
import { toast } from "react-hot-toast";
import { advisorServiceApi } from "@/services/advisorServiceApi";


export interface AdvisorTableProps {
  advisors: {
    id: number;
    name: string;
    mobile: string;
    email: string;
    description: string;
    age: number;
    experienceInYears: number;
    photo: string;
    attachment1?: string;
    attachment2?: string;
    isActive: boolean;
    employeeId?: number;
    agentId?: string;
    smartfloId?: string;
    tataTeleUserId?: string;
  }[];
  error: string | null;
  onUpdate?: () => void;
}


export interface Advisor {
  id: number;
  name: string;
  mobile: string;
  email: string;
  description: string;
  age: number;
  experienceInYears: number;
  photo: string;
  attachment1?: string;
  attachment2?: string;
  isActive: boolean;
  employeeId?: number;
  agentId?: string;
  smartfloId?: string;
  tataTeleUserId?: string;
}


export default function AdvisorTable({ 
  advisors = [], 
  error,
  onUpdate
}: AdvisorTableProps) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [enableSmartfloModalOpen, setEnableSmartfloModalOpen] = useState(false);
  const [deleteSmartfloModalOpen, setDeleteSmartfloModalOpen] = useState(false);
  const [smartfloNumbers, setSmartfloNumbers] = useState<{id: string; did: string}[]>([]);
  const [selectedNumber, setSelectedNumber] = useState<string>("");
  const [isLoadingSmartflo, setIsLoadingSmartflo] = useState(false);
  const [isSubmittingSmartflo, setIsSubmittingSmartflo] = useState(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<number>>(new Set());
  
  // Use ref instead of state to avoid re-renders
  const overflowCheckRef = useRef<Set<number>>(new Set());

  const toggleDescription = (advisorId: number) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(advisorId)) {
        newSet.delete(advisorId);
      } else {
        newSet.add(advisorId);
      }
      return newSet;
    });
  };

  // Use IntersectionObserver for efficient overflow detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            const id = element.dataset.advisorId;
            if (id && element.scrollWidth > element.offsetWidth) {
              overflowCheckRef.current.add(Number(id));
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all description elements
    const elements = document.querySelectorAll('[data-description-cell]');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [advisors]);

  const handleCloseEdit = () => {
    setEditModalOpen(false);
    if (onUpdate) onUpdate();
  };

  const handleCloseDelete = () => {
    setDeleteModalOpen(false);
    if (onUpdate) onUpdate();
  };

  const handleCloseEnableSmartflo = () => {
    setEnableSmartfloModalOpen(false);
  };

  const handleCloseDeleteSmartflo = () => {
    setDeleteSmartfloModalOpen(false);
  };

  const fetchSmartfloNumbers = async (token: string) => {
    try {
      const response = await fetch('https://api-smartflo.tatateleservices.com/v1/my_number', {
        headers: { Authorization: token, Accept: 'application/json' },
      });
      const data = await response.json();
      const availableNumbers = (data || []).filter((num: { destination: string | null }) => !num.destination);
      setSmartfloNumbers(availableNumbers);
    } catch (error) {
      console.error('Error fetching numbers:', error);
    }
  };

  const generatePassword = (): string => {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    const digits = "0123456789";
    
    // 2 uppercase
    const upperChars = [
      upper[Math.floor(Math.random() * upper.length)],
      upper[Math.floor(Math.random() * upper.length)]
    ];
    // 2 lowercase
    const lowerChars = [
      lower[Math.floor(Math.random() * lower.length)],
      lower[Math.floor(Math.random() * lower.length)]
    ];
    // 2 numbers
    const numberChars = [
      digits[Math.floor(Math.random() * digits.length)],
      digits[Math.floor(Math.random() * digits.length)]
    ];
    // 2 special (middle only)
    const specialChars = [
      special[Math.floor(Math.random() * special.length)],
      special[Math.floor(Math.random() * special.length)]
    ];
    
    // Start: 1 upper, lower, or number (no special)
    const startPool = upper + lower + digits;
    const startChar = startPool[Math.floor(Math.random() * startPool.length)];
    
    // End: 1 upper, lower, or number (no special)
    const endChar = startPool[Math.floor(Math.random() * startPool.length)];
    
    // Middle 8 chars: shuffle all required chars
    const middle = [...upperChars, ...lowerChars, ...numberChars, ...specialChars];
    // Shuffle middle
    for (let i = middle.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [middle[i], middle[j]] = [middle[j], middle[i]];
    }
    
    return startChar + middle.join("") + endChar;
  };

  const createSmartfloUser = async () => {
    if (!selectedAdvisor || !selectedNumber) {
      toast.error('Please select a phone number');
      return;
    }

    const token = localStorage.getItem('smartflo_token');
    console.log('DEBUG Token from storage:', token ? 'HAS TOKEN' : 'NO TOKEN');
    if (!token) {
      toast.error('No token found');
      return;
    }

    setIsSubmittingSmartflo(true);

    try {
      const loginId = selectedAdvisor.email.split('@')[0];
      const password = generatePassword();

      const response = await fetch('https://api-smartflo.tatateleservices.com/v1/user', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          create_agent: true,
          status: true,
          assign_extension: true,
          name: selectedAdvisor.name,
          number: selectedAdvisor.mobile,
          email: selectedAdvisor.email,
          login_id: loginId,
          password: password,
          user_role: 92957,
          caller_id: [parseInt(selectedNumber)],
        }),
      });

      const responseText = await response.text();
      if (!responseText) {
        throw new Error('Empty response from Smartflo API');
      }
      
      const data = JSON.parse(responseText);
      if (data.success) {
        // Get the DID number from selected
        const selectedNumberData = smartfloNumbers.find(n => n.id === selectedNumber);
        const didNumber = selectedNumberData ? selectedNumberData.did.replace('+91', '0') : '';
        
        // Save to backend
        let isAdmin = false;
        const oldMobile = selectedAdvisor.mobile;
        try {
          const updateResponse = await advisorServiceApi.updateSmartflo(selectedAdvisor.id, {
            agentId: data.data.agent_id,
            smartfloId: data.data.agent_extension,
            tataTeleUserId: data.data.id.toString(),
            mobile: didNumber,
            employeeId: selectedAdvisor.employeeId,
            password: password,
            oldMobile: oldMobile,
          });
          
          const responseData = updateResponse.data as { data: { agentId: string; smartfloId: string; tataTeleUserId: string }; isAdmin?: boolean };
          isAdmin = responseData?.isAdmin ?? false;
          
          console.log('DEBUG 1 - responseData:', JSON.stringify(responseData));
          console.log('DEBUG 2 - isAdmin:', isAdmin);
          console.log('DEBUG 3 - token:', token ? 'token exists' : 'NO TOKEN');
          console.log('DEBUG 4 - selectedNumber:', selectedNumber);
          console.log('DEBUG 5 - agent_id:', data.data?.agent_id);
          
          // Update number destination in Smartflo - ALWAYS run for all advisors
          await fetch(`https://api-smartflo.tatateleservices.com/v1/my_number/${selectedNumber}`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              destination: `agent||${data.data.agent_id}`,
            }),
          });
          
          // Update user_for_cdr - only for non-admin
          if (!isAdmin) {
            console.log('DEBUG 6 - Running PATCH for non-admin');
            await fetch(`https://api-smartflo.tatateleservices.com/v1/user/${data.data.id}`, {
              method: 'PATCH',
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                user_for_cdr: {
                  type: "agent",
                  value: [data.data.agent_id],
                },
              }),
            });
          }
          
          toast.success('Smartflo user created successfully');
        } catch (error) {
          console.error('Error saving to DB:', error);
          toast.error('Failed to save Smartflo data');
        }
        setEnableSmartfloModalOpen(false);
        setSmartfloNumbers([]);
        setSelectedNumber("");
        if (onUpdate) onUpdate();
      } else {
        toast.error('Failed to create Smartflo user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create Smartflo user');
    } finally {
      setIsSubmittingSmartflo(false);
    }
  };

  const deleteSmartfloUser = async () => {
    if (!selectedAdvisor || !selectedAdvisor.tataTeleUserId) {
      toast.error('No Smartflo user found');
      return;
    }

    setIsSubmittingSmartflo(true);

    try {
      const tokenResponse = await fetch('https://api-smartflo.tatateleservices.com/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: process.env.NEXT_PUBLIC_TATA_TELE_USER_NAME,
          password: process.env.NEXT_PUBLIC_TATA_TELE_PASSWORD,
        }),
      });
      const tokenData = await tokenResponse.json();
      const token = tokenData.access_token;

      if (!token) {
        toast.error('Failed to get Smartflo token');
        setIsSubmittingSmartflo(false);
        return;
      }

      const response = await fetch(`https://api-smartflo.tatateleservices.com/v1/user/${selectedAdvisor.tataTeleUserId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        // Clear from backend only if Smartflo delete succeeds
        try {
          await advisorServiceApi.clearSmartflo(selectedAdvisor.id);
          toast.success('Smartflo user deleted successfully');
        } catch (error) {
          console.error('Error clearing from DB:', error);
          toast.error('Failed to clear Smartflo data');
        }
        setDeleteSmartfloModalOpen(false);
        if (onUpdate) onUpdate();
      } else {
        toast.error('Failed to delete Smartflo user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete Smartflo user');
    } finally {
      setIsSubmittingSmartflo(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        {error && <div className="m-4"><p style={{ color: "red" }}>{error}</p></div>}
        {!error && advisors.length > 0 ? (
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400 w-[80px]">
                  Photo
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400 min-w-[150px]">
                  Name
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400 min-w-[150px]">
                  Employee
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400 w-[120px]">
                  Mobile
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400 min-w-[200px]">
                  Email
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400 min-w-[200px]">
                  Description
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400 w-[70px]">
                  Age
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400 w-[110px]">
                  Experience
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400 w-[120px]">
                  Attachments
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400 w-[100px]">
                  Status
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-xs dark:text-gray-400 w-[120px] sticky right-0 bg-white dark:bg-white/[0.03]">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
              
            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {advisors.map((advisor) => {
                // Compute these once per row
                const isExpanded = expandedDescriptions.has(advisor.id);
                const hasDescription = advisor.description && advisor.description.length > 50;
                
                return (
                  <TableRow key={advisor.id}>
                    {/* Photo */}
                    <TableCell className="px-4 py-3 text-start w-[80px]">
                      {advisor.photo ? (
                        <img 
                          src={advisor.photo} 
                          alt={advisor.name}
                          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-500 text-xs">No Photo</span>
                        </div>
                      )}
                    </TableCell>
                    
                    {/* Name */}
                    <TableCell className="px-5 py-4 text-start min-w-[150px]">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90 truncate">
                        {advisor.name}
                      </span>
                    </TableCell>
                    
                    {/* Employee */}
                    <TableCell className="px-5 py-4 text-start min-w-[150px]">
                      {advisor.employeeId ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                          ID: {advisor.employeeId}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-theme-sm">-</span>
                      )}
                    </TableCell>
                    
                    {/* Mobile */}
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 w-[120px]">
                      <div className="whitespace-nowrap">{advisor.mobile}</div>
                    </TableCell>
                    
                    {/* Email */}
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 min-w-[200px]">
                      <div className="truncate">{advisor.email}</div>
                    </TableCell>
                    
                    {/* Optimized Description */}
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 min-w-[200px]">
                      <div className="max-w-[200px]">
                        <div 
                          data-description-cell
                          data-advisor-id={advisor.id}
                          className={isExpanded ? 'whitespace-normal break-words' : 'truncate'}
                        >
                          {advisor.description}
                        </div>
                        {hasDescription && (
                          <button
                            className="text-blue-600 hover:underline text-xs mt-1 font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDescription(advisor.id);
                            }}
                          >
                            {isExpanded ? 'Show less' : 'Read more'}
                          </button>
                        )}
                      </div>
                    </TableCell>

                    {/* Age */}
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 w-[70px]">
                      {advisor.age}
                    </TableCell>
                    
                    {/* Experience */}
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 w-[110px]">
                      <div className="whitespace-nowrap">{advisor.experienceInYears} {advisor.experienceInYears === 1 ? 'year' : 'years'}</div>
                    </TableCell>
                    
                    {/* Attachments */}
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 w-[120px]">
                      <div className="flex flex-col gap-1">
                        {advisor.attachment1 && (
                          <a 
                            href={advisor.attachment1} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-xs whitespace-nowrap"
                          >
                            File 1
                          </a>
                        )}
                        {advisor.attachment2 && (
                          <a 
                            href={advisor.attachment2} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-xs whitespace-nowrap"
                          >
                            File 2
                          </a>
                        )}
                        {!advisor.attachment1 && !advisor.attachment2 && (
                          <span className="text-gray-400 text-xs">None</span>
                        )}
                      </div>
                    </TableCell>
                    
                    {/* Status */}
                    <TableCell className="px-4 py-3 text-start text-theme-sm w-[100px]">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                        advisor.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {advisor.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    
                    {/* Actions */}
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 w-[120px] sticky right-0 bg-white dark:bg-white/[0.03]">
                      <div className="flex space-x-2 whitespace-nowrap">
                        {advisor.agentId && advisor.smartfloId ? (
                          <button
                            onClick={() => {
                              setSelectedAdvisor(advisor);
                              setDeleteSmartfloModalOpen(true);
                            }}
                            className="text-orange-600 hover:text-orange-800 font-medium"
                          >
                            Disable Smartflo
                          </button>
                        ) : (
                          <button
                            onClick={async () => {
                              setSelectedAdvisor(advisor);
                              setIsLoadingSmartflo(true);
                              setEnableSmartfloModalOpen(true);
                              try {
                                const response = await fetch('https://api-smartflo.tatateleservices.com/v1/auth/login', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    email: process.env.NEXT_PUBLIC_TATA_TELE_USER_NAME,
                                    password: process.env.NEXT_PUBLIC_TATA_TELE_PASSWORD,
                                  }),
                                });
                                const data = await response.json();
                                if (data.success && data.access_token) {
                                  localStorage.setItem('smartflo_token', data.access_token);
                                  await fetchSmartfloNumbers(data.access_token);
                                } else {
                                  toast.error('Failed to get Smartflo token');
                                  setEnableSmartfloModalOpen(false);
                                }
                              } catch (error) {
                                console.error('Error getting token:', error);
                                toast.error('Failed to get Smartflo token');
                                setEnableSmartfloModalOpen(false);
                              } finally {
                                setIsLoadingSmartflo(false);
                              }
                            }}
                            className="text-green-600 hover:text-green-800 font-medium"
                          >
                            Enable Smartflo
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedAdvisor(advisor);
                            setEditModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAdvisor(advisor);
                            setDeleteModalOpen(true);
                          }}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          !error && <div className="m-4">
            <p>No advisors found.</p>
          </div>
        )}
      </div>
      
      {/* Modals */}
      {selectedAdvisor && (
        <>
          <EditAdvisor
            isOpen={editModalOpen}
            onClose={handleCloseEdit}
            advisor={selectedAdvisor}
          />
          
          <DeleteAdvisor
            isOpen={deleteModalOpen}
            onClose={handleCloseDelete}
            advisor={selectedAdvisor}
          />

          {enableSmartfloModalOpen && (
            <div className="fixed inset-0 bg-black-opacity flex items-center justify-center p-4 z-99999">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md dark:bg-gray-800">
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                  <h2 className="text-xl font-semibold dark:text-white">Create Smartflo</h2>
                  <button
                    onClick={handleCloseEnableSmartflo}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-300 text-2xl"
                  >
                    ×
                  </button>
                </div>
                <div className="p-4">
                  {isLoadingSmartflo ? (
                    <div className="flex items-center justify-center py-8">
                      <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <select
                        value={selectedNumber}
                        onChange={(e) => setSelectedNumber(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-transparent py-2.5 px-4 text-sm text-gray-800 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                      >
                        <option value="">Select phone number</option>
                        {smartfloNumbers.map((num) => (
                          <option key={num.id} value={num.id}>{num.did}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <div className="flex justify-between gap-3 p-4 border-t dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => {
                      setEnableSmartfloModalOpen(false);
                      setIsLoadingSmartflo(false);
                      setSmartfloNumbers([]);
                      setSelectedNumber("");
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={createSmartfloUser}
                    disabled={isSubmittingSmartflo || isLoadingSmartflo || !selectedNumber}
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                  >
                    {isSubmittingSmartflo ? 'Creating...' : 'Confirm'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Smartflo Modal */}
      {deleteSmartfloModalOpen && (
        <div className="fixed inset-0 bg-black-opacity flex items-center justify-center p-4 z-99999">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md dark:bg-gray-800">
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold dark:text-white">Delete Smartflo</h2>
              <button
                onClick={handleCloseDeleteSmartflo}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              {isLoadingSmartflo || isSubmittingSmartflo ? (
                <div className="flex items-center justify-center py-8">
                  <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : (
                <p className="text-gray-700 dark:text-gray-300">
                  Are you sure you want to delete Smartflo for <span className="font-semibold">{selectedAdvisor?.name}</span>?
                </p>
              )}
            </div>
            <div className="flex justify-between gap-3 p-4 border-t dark:border-gray-700">
              <button
                type="button"
                onClick={handleCloseDeleteSmartflo}
                disabled={isSubmittingSmartflo}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={deleteSmartfloUser}
                disabled={isSubmittingSmartflo || isLoadingSmartflo}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed"
              >
                {isSubmittingSmartflo ? 'Deleting...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
