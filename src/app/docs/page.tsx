import React from 'react'
import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'
function Page() {
    return (
        <div>
            <h2> API Doc</h2>
            <SwaggerUI deepLinking={true} url="swagger.json" />
        </div>
    )
}

export default Page
