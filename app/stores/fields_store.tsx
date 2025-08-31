"use client";

import { createStore } from "zustand/vanilla";
import type {
  ProjectResponse,
  FieldResponse,
  FieldCreate,
  FieldUpdate
} from "../types";
import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";
import api from "../axios";

interface FieldsStoreProps {
  project: ProjectResponse;
}

interface FieldsStateType extends FieldsStoreProps {
    fields: FieldResponse[];
    addField: (data: FieldCreate) => Promise<FieldResponse>;
    addChildField: (parentFieldId: string, data: FieldCreate) => Promise<FieldResponse>;
    updateField: (fieldId: string, data: FieldUpdate) => Promise<FieldResponse>;
    deleteField: (fieldId: string) => Promise<void>;
}

type FieldsStoreType = ReturnType<typeof createFieldsStore>;

const createFieldsStore = (initProps: FieldsStoreProps) => {
  return createStore<FieldsStateType>()((set, get) => ({
    ...initProps,
    fields: initProps.project.fields,
    addField: async (data) => {
      const response = await api.post<FieldResponse>(`/api/v1/projects/${get().project.id}/fields/`, data);
      set((state) => ({ ...state, fields: [...state.fields, response.data] }));
      return response.data;
    },
    addChildField: async (parentFieldId, data) => {
      const response = await api.post<FieldResponse>(`/api/v1/projects/${get().project.id}/fields/${parentFieldId}/add_child`, data);
      const addChildToParent = (fields: FieldResponse[], parentId: string, newChild: FieldResponse): FieldResponse[] => {
        return fields.map((field) => {
          if (field.id === parentId) {
            return {
              ...field,
              children: [...(field.children || []), newChild]
            };
          }
          if (field.children && field.children.length > 0) {
            return {
              ...field,
              children: addChildToParent(field.children, parentId, newChild)
            };
          }
          return field;
        });
      };
      set((state) => ({ ...state, fields: addChildToParent(state.fields, parentFieldId, response.data) }));
      return response.data;
    },
    updateField: async (fieldId, data) => {
      const response = await api.put<FieldResponse>(`/api/v1/projects/${get().project.id}/fields/${fieldId}`, data);
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
      set((state) => ({ ...state, fields: updateNestedField(state.fields, fieldId, response.data) }));
      return response.data;
    },
    deleteField: async (fieldId) => {
      await api.delete<void>(`/api/v1/projects/${get().project.id}/fields/${fieldId}`);
      const deleteNestedField = (fields: FieldResponse[], targetId: string): FieldResponse[] => {
        return fields
          .filter((field) => field.id !== targetId)
          .map((field) => {
            if (field.children && field.children.length > 0) {
              return {
                ...field,
                children: deleteNestedField(field.children, targetId)
              };
            }
            return field;
          });
      };
      set((state) => ({ ...state, fields: deleteNestedField(get().fields, fieldId) }));
    },
  }));
};

type FieldsProviderProps = React.PropsWithChildren<FieldsStoreProps>;

const FieldsContext = createContext<FieldsStoreType | null>(null);

export function FieldsProvider({ children, project }: FieldsProviderProps) {
  const storeRef = useRef<FieldsStoreType>(null);
  if (!storeRef.current) {
    storeRef.current = createFieldsStore({ project });
  }
  return (
    <FieldsContext.Provider value={storeRef.current}>
      {children}
    </FieldsContext.Provider>
  );
}

export function useFieldsContext<T>(selector: (state: FieldsStateType) => T): T {
  const store = useContext(FieldsContext);
  if (!store) throw new Error("Missing FieldsContext.Provider in the tree");
  return useStore(store, selector);
}
