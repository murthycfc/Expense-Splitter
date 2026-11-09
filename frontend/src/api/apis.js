
import apiClient from "./apiClient";
const BASE_URL = "";

export async function addUser(request) {
    const response = await apiClient.post(`${BASE_URL}/api/addUser`, request)
    return response.data;
}

export async function getAllUsers() {
    const response = await apiClient.get(`${BASE_URL}/api/getAllUsers`)
    return response.data;
}

export async function loadGroups() {
    const response = await apiClient.get(`/api/groups/getGroups`);
    return response.data;
}

export async function createGroup(request) {
    const response = await apiClient.post('/api/groups/createGroup', request);
    return response.data;
}

export async function updateGroup(groupId,request) {
    const response = await apiClient.put(`/api/groups/${groupId}/update`, request);
    return response.data;
}

export async function deleteGroup(groupId) {
    const response = await apiClient.delete(`/api/groups/${groupId}/delete`);
    return response.data;
}

export async function getGroup(groupId) {
    const response = await apiClient.get(`/api/groups/${groupId}/getGroup`)
    return response.data;
}

export async function getExpenses(groupId, page=0, size=10){
    const response = await apiClient.get(`/api/groups/${groupId}/getExpenses`, {params: {page, size}});
    return response.data;
}

export async function addExpense(request) {
    const response = await apiClient.post(`/api/addExpense`, request)
    return response.data;
}

export async function getAllExpenses() {
    const response = await apiClient.get(`${BASE_URL}/api/getAllExpenses`);
    return response.data;
}

export async function getMemberBalances() {
    const response = await apiClient.get(`${BASE_URL}/api/getMemberBalances`);
    return response.data;
}

export async function getTotoalExpenses() {
    const response = await apiClient.get(`${BASE_URL}/api/getTotoalExpenses`);
    return response.data;
}

export async function deleteUser(userId) {
    const response = await apiClient.delete(`${BASE_URL}/api/deleteUser/${userId}`)
    return response.data;
    
}

export async function deleteExpense(expenseId) {
    const response = await apiClient.delete(`${BASE_URL}/api/deleteExpense/${expenseId}`)
    return response.data;   
}

export async function editExpense(expenseId, request) {
    const response = await apiClient.put(`${BASE_URL}/api/editExpense/${expenseId}`,
        request
    );
    return response.data;
}

export async function getExpense(expenseId) {
    const response = await apiClient.get(`${BASE_URL}/api/getExpense/${expenseId}`)
    return response.data;
}

export async function login(request) {
    const response = await apiClient.post(`${BASE_URL}/auth/login`,request);
    return response.data;
}

export async function register(request) {
    const response = await apiClient.post(`${BASE_URL}/auth/register`,request);
    return response.data;
}

export async function logout() {
    const response = await apiClient.post(`${BASE_URL}/api/logout`);
    return response.data;
}