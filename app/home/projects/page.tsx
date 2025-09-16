"use client"
import { useProjectsContext } from "@/app/stores/projects_store"
import { ColumnDef } from "@tanstack/react-table"
import { ProjectResponse } from "@/app/types"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { useEffect, useState } from "react"
import { useAuthContext } from "@/app/stores/auth_store"
import { Input } from "@/components/ui/input";
import React from "react";
import { SiteHeader } from "../Header"
import { IconArrowRight, IconPlus } from "@tabler/icons-react";
import { Textarea } from "@/components/ui/textarea"

interface ProjectFormData {
    name: string;
    description: string;
}

export default function HomeProjectsPage() {
    const projects = useProjectsContext((s) => s.projects)
    const createProject = useProjectsContext((s) => s.createProject);
    const updateProject = useProjectsContext((s) => s.updateProject);
    const deleteProject = useProjectsContext((s) => s.deleteProject);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [project, setProject] = useState<ProjectResponse>(null);
    const user = useAuthContext((s) => s.user);
    const [opened, setOpened] = useState(false);

    const [formData, setFormData] = useState<ProjectFormData>({
        name: project?.name ? project.name : "",
        description: project?.description ? project.description : "",
    });

    const columns: ColumnDef<ProjectResponse>[] = [
        {
            accessorKey: "name",
            header: () => <div className="font-bold text-foreground">Name</div>,
        },
        {
            accessorKey: "description",
            header: () => <div className="font-bold text-foreground">Description</div>,
        },
        {
            accessorKey: "created_at",
            header: () => <div className="font-bold text-foreground">Created At</div>,
            cell: ({ row }) => {
                const date = new Date(row.original.created_at);
                return <span className="text-muted-foreground">{date.toLocaleDateString() + ' ' + date.toLocaleTimeString()}</span>;
            }
        },
        {
            accessorKey: "fields",
            header: () => <div className="font-bold text-foreground"># Fields</div>,
            cell: ({ row }) => <div className="text-foreground">{row.original.fields.length}</div>
        },
        {
            accessorKey: "receipts",
            header: () => <div className="font-bold text-foreground"># Receipts</div>,
            cell: ({ row }) => <div className="text-foreground">{row.original.receipts.length}</div>
        },
    ]

    const actionColumn: ColumnDef<ProjectResponse> = {
        id: "actions",
        header: () => null,
        cell: ({ row }) => {
            const project = row.original as ProjectResponse;
            return (
                <div className="flex items-center gap-5">
                    <Button
                        variant="outline"
                        className="flex items-center gap-1 text-foreground border-border px-3 py-1"
                        asChild
                    >
                        <a href={`/projects/${project.id}/receipts`} className="">
                            <span>View Details</span>
                            <IconArrowRight size={16} className="text-foreground" />
                        </a>
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                                <span className="sr-only">Open menu</span>
                                ⋮
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="min-w-[200px] bg-background border border-border rounded-md shadow-md"
                        >
                            <DropdownMenuItem
                                onClick={() => handleEdit(project)}
                                className="px-4 py-2 hover:bg-muted cursor-pointer text-foreground"
                            >
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleDelete(project.id)}
                                className="px-4 py-2 hover:bg-muted cursor-pointer text-destructive"
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    };
    const columnsWithActions = [...columns.filter(col => col.id !== "actions"), actionColumn];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (project) {
                await updateProject(project.id, formData);
            } else {
                await createProject(formData);
            }
            setFormData({ name: "", description: "" });
            setProject(null);
            setOpened(false);
        } catch (error) {
            console.error("Error creating project:", error);
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleDelete = async (id: string) => {
        try {
            await deleteProject(id);
        } catch (error) {
            console.error("Error deleting project:", error);
        } finally {
        }
    };

    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name || "",
                description: project.description || "",
            });
        } else {
            setFormData({ name: "", description: "" });
        }
    }, [project, opened]);

    const handleEdit = (proj: ProjectResponse) => {
        setProject(proj);
        setOpened(true);
    };

    return (
        <>
            <SiteHeader title={"Projects"} isSubscribed={user.is_subscribed} />
            <div className="flex flex-col p-8 bg-background">
                <div className="flex items-center justify-between mb-6 w-full">
                    <div></div>
                    <div className="flex justify-between w-full items-end">
                        <span className="text-muted-foreground text-2xl mb-2">Welcome back, <code className="text-primary font-bold">{user.first_name}</code>!</span>
                        <Button className="w-36 flex items-center gap-2" data-umami-event="new_project@dashboard_projects" onClick={() => { setProject(null); setOpened(true); }} disabled={!user.is_subscribed}>
                            <span className="bg-background rounded-full p-1 flex items-center justify-center">
                                <IconPlus size={18} className="text-foreground" />
                            </span>
                            New Project
                        </Button>
                    </div>
                </div>
                <div className="mt-4">
                    <DataTable columns={columnsWithActions} data={projects || []} />
                </div>
                <Drawer open={opened} onOpenChange={setOpened}>
                    <DrawerContent className="max-w-md mx-auto bg-background border border-border">
                        <DrawerHeader>
                            <DrawerTitle className="text-foreground">{project ? "Edit Project" : "Create New Project"}</DrawerTitle>
                            <DrawerDescription className="text-muted-foreground">{project ? "Update your project details." : "Enter details for your new project."}</DrawerDescription>
                        </DrawerHeader>
                        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
                            <Input
                                placeholder="Project Name"
                                value={formData.name}
                                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                required
                                className="text-foreground bg-background border-border"
                            />
                            <Textarea
                                className="text-foreground bg-background border-border"
                                placeholder="Project Description"
                                value={formData.description}
                                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            />
                            <DrawerFooter>
                                <Button type="submit" disabled={isSubmitting} data-umami-event={project ? "update" : "create" + "_projects@dashboard_projects"} className="bg-primary text-primary-foreground">
                                    {isSubmitting ? (project ? "Updating..." : "Creating...") : (project ? "Update Project" : "Create Project")}
                                </Button>
                                <DrawerClose asChild>
                                    <Button variant="outline" type="button" className="text-foreground bg-background border-border">Cancel</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </form>
                    </DrawerContent>
                </Drawer>
            </div>
        </>
    )
}