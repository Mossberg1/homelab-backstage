import { Card, CardContent } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';


export const GaugeSkeleton = () => (
    <Card style={{ width: 250, height: 200 }}>
        <CardContent>
            <Skeleton variant='text' width={120} height={30}/>
            <Skeleton variant='circle' width={80} height={80}/>
        </CardContent>
    </Card>
);