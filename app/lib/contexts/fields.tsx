"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode,
} from "react";
import api from "../axios";
import {
    ProjectResponse,
    FieldResponse,
    FieldCreate,
    FieldUpdate
} from "../types";

interface FieldsContextType {
    project: ProjectResponse
    fields: FieldResponse[]
    loading: boolean;
    error: string | null;
    addField: (
        data: FieldCreate
    ) => Promise<FieldResponse>;
    addChildField: (
        parentFieldId: string,
        data: FieldCreate
    ) => Promise<FieldResponse>;
    updateField: (
        fieldId: string,
        data: FieldUpdate
    ) => Promise<FieldResponse>;
    deleteField: (
        fieldId: string
    ) => Promise<void>;
}

const FieldsContext = createContext<FieldsContextType | undefined>(undefined);

export function FieldsProvider({ children, project }: { children: ReactNode, project: ProjectResponse }) {

    const [fields, setFields] = useState<FieldResponse[]>(project.fields);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addField = async (data: FieldCreate) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.post<FieldResponse>(`/api/v1/projects/${project.id}/fields/`, data);
            setFields((prev) => [...prev, response.data])
            return response.data;
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to add field to project");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const addChildField = async (parentFieldId: string, data: FieldCreate) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.post<FieldResponse>(`/api/v1/projects/${project.id}/fields/${parentFieldId}/add_child`, data);

            // Helper function to recursively add child to the correct parent
            const addChildToParent = (fields: FieldResponse[], parentId: string, newChild: FieldResponse): FieldResponse[] => {
                return fields.map((field) => {
                    if (field.id === parentId) {
                        return {
                            ...field,
                            children: [...(field.children || []), newChild]
                        };
                    }
                    // If this field has children, recursively search them
                    if (field.children && field.children.length > 0) {
                        return {
                            ...field,
                            children: addChildToParent(field.children, parentId, newChild)
                        };
                    }
                    return field;
                });
            };

            setFields((prev) => addChildToParent(prev, parentFieldId, response.data));
            return response.data;
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to add child field");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateField = async (fieldId: string, data: FieldUpdate) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.put<FieldResponse>(`/api/v1/projects/${project.id}/fields/${fieldId}`, data);
            const updateNestedField = (fields: FieldResponse[], targetId: string, updatedField: FieldResponse): FieldResponse[] => {
                return fields.map((field) => {
                    if (field.id === targetId) {
                        return updatedField;
                    }
                    if (field.children && field.children.length > 0) {
                        return {
                            ...field,
                            children: updateNestedField(field.children, targetId, updatedField)
                        };
                    }
                    return field;
                });
            };
            setFields((prev) => updateNestedField(prev, fieldId, response.data));
            return response.data;
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to update field");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteField = async (fieldId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.delete<void>(`/api/v1/projects/${project.id}/fields/${fieldId}`);

            // Helper function to recursively delete field from nested structure
            const deleteNestedField = (fields: FieldResponse[], targetId: string): FieldResponse[] => {
                return fields
                    .filter((field) => field.id !== targetId) // Remove field if it matches targetId
                    .map((field) => {
                        // If this field has children, recursively delete from them
                        if (field.children && field.children.length > 0) {
                            return {
                                ...field,
                                children: deleteNestedField(field.children, targetId)
                            };
                        }
                        return field;
                    });
            };

            setFields((prev) => deleteNestedField(prev, fieldId));
            return response.data;
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to delete field");
            throw err;
        } finally {
            setLoading(false);
        }
    };


    return (
        <FieldsContext.Provider
            value={{
                project,
                fields,
                loading,
                error,
                addField,
                addChildField,
                updateField,
                deleteField
            }}
        >
            {children}
        </FieldsContext.Provider>
    );
}

export function useFields() {
    const context = useContext(FieldsContext);
    if (context === undefined) {
        throw new Error("useFields must be used within a FieldsProvider");
    }
    return context;
}
