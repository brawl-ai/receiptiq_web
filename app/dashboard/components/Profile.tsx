import { Paper, Text, Title } from "@mantine/core";
import { useAuth } from "../../lib/contexts/auth";


export default function Profile() {
    const { user, } = useAuth()

    return <Paper>
        <Title>Manage Your Profile</Title>
        <Text>First Name: {user.first_name}</Text>
        <Text>Last Name: {user.last_name}</Text>
        <Text>Email: {user.email}</Text>
    </Paper>
}