from drf_spectacular.plumbing import build_object_type
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter, OpenApiResponse, extend_schema
from drf_spectacular.openapi import AutoSchema

class CustomSchemaGenerator(AutoSchema):
    def get_operation(self, path, path_regex, method, callback):
        operation = super().get_operation(path, path_regex, method, callback)
        
        # Handle token refresh endpoint specifically
        if path == '/api/token/refresh/' and method == 'POST':
            operation['requestBody'] = {
                'content': {
                    'application/json': {
                        'schema': {
                            'type': 'object',
                            'properties': {
                                'refresh': {'type': 'string'},
                            },
                            'required': ['refresh'],
                        }
                    }
                }
            }
            operation['responses'] = {
                '200': {
                    'content': {
                        'application/json': {
                            'schema': {
                                'type': 'object',
                                'properties': {
                                    'access': {'type': 'string'},
                                    'refresh': {'type': 'string'},
                                }
                            }
                        }
                    }
                }
            }
        return operation
