'use client';
import React, { useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import {
 useSignAndExecuteTransaction,
 ConnectButton,
 useCurrentAccount
} from '@mysten/dapp-kit';
import { CheckCircleIcon, ExclamationCircleIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

const LoyaltyCardPage = () => {
 const currentAccount = useCurrentAccount();
 const [loading, setLoading] = useState(false);
 const [packageId, setPackageId] = useState('');
 const [feedbackMessage, setFeedbackMessage] = useState({ type: '', message: '' });

 // Form states
 const [mintForm, setMintForm] = useState({
 customerId: '',
 imageUrl: ''
 });

 const { mutate: signAndExecute } = useSignAndExecuteTransaction();

interface MintForm {
    customerId: string;
    imageUrl: string;
}

interface FeedbackMessage {
    type: string;
    message: string;
}

const handleMintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMintForm({ ...mintForm, [e.target.name]: e.target.value });
};

 // Action: mint a new Loyalty card
 const mintLoyalty = async () => {
 if (!currentAccount) {
 setFeedbackMessage({ type: 'error', message: 'Please connect your wallet first.' });
 return;
 }
 try {
 setLoading(true);
 setFeedbackMessage({ type: '', message: '' });
 const tx = new Transaction();
 tx.moveCall({
 target: `${packageId}::loyalty_card::mint_loyalty`,
 arguments: [
 tx.pure.address(mintForm.customerId),
 tx.pure.string(mintForm.imageUrl)
 ]
 });
 await signAndExecute({ transaction: tx }, {
 onSuccess: () => {
 setFeedbackMessage({ type: 'success', message: 'NFT minted successfully!' });
 setMintForm({ customerId: '', imageUrl: '' });
 },
 onError: (error) => {
 setFeedbackMessage({ type: 'error', message: `Minting failed: ${error.message}` });
 }
 });
 } catch (error) {
 console.error('Error minting loyalty card:', error);
 let errorMessage = 'An unexpected error occurred.';
 if (error instanceof Error) {
   errorMessage = `An unexpected error occurred: ${error.message}`;
 }
 setFeedbackMessage({ type: 'error', message: errorMessage });
 } finally {
 setLoading(false);
 }
 };

 return (
 <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
 <div className="w-full max-w-md mx-auto">
 <div className="text-center mb-8">
 <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Mint Your NFT on SUI</h1>
 <p className="text-gray-600 dark:text-gray-400 mt-2">Create your unique loyalty card on the Sui network.</p>
 </div>

 <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6 text-center">
 <h2 className="text-xl font-bold text-gray-700 dark:text-white mb-4">Connect Your Wallet</h2>
 <div className="flex justify-center">
   <ConnectButton />
 </div>
 </div>

 <div className="space-y-6">
 {/* Package ID Input */}
 <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
 <label htmlFor="packageId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Package ID</label>
 <input
 id="packageId"
 type="text"
 value={packageId}
 onChange={(e) => setPackageId(e.target.value)}
 placeholder="Enter the Package ID"
 className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
 />
 </div>

 {/* Mint Loyalty Card Form */}
 <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
 <div className="space-y-4">
 <div>
 <label htmlFor="customerId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Wallet Address</label>
 <input
 id="customerId"
 type="text"
 name="customerId"
 value={mintForm.customerId}
 onChange={handleMintChange}
 placeholder="Enter Customer Sui Address"
 className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
 />
 </div>
 <div>
 <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL</label>
 <input
 id="imageUrl"
 type="text"
 name="imageUrl"
 value={mintForm.imageUrl}
 onChange={handleMintChange}
 placeholder="Enter Image URL for your NFT"
 className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
 />
 </div>
 <button
 onClick={mintLoyalty}
 disabled={loading || !mintForm.customerId.trim() || !mintForm.imageUrl.trim() || !packageId.trim()}
 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
 >
 {loading ? (
 <>
 <ArrowPathIcon className="animate-spin h-5 w-5 mr-3" />
 Minting...
 </>
 ) : (
 'Mint your NFT'
 )}
 </button>
 </div>
 </div>

 {/* Feedback Message */}
 {feedbackMessage.message && (
 <div className={`flex items-center p-4 rounded-md ${feedbackMessage.type === 'success' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
 {feedbackMessage.type === 'success' ? (
 <CheckCircleIcon className="h-5 w-5 text-green-500" />
 ) : (
 <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
 )}
 <p className={`ml-3 text-sm font-medium ${feedbackMessage.type === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
 {feedbackMessage.message}
 </p>
 </div>
 )}
 </div>
 </div>
 </div>
 );
};

export default LoyaltyCardPage;