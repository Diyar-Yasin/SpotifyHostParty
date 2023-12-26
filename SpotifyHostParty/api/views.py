from django.shortcuts import render
from rest_framework import generics, status
from .serializers import RoomSerializer, CreateRoomSerializer, RoomIDSerializer, UpdateRoomSerializer
from .models import Room
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse

# Create your views here.
class RoomView( generics.ListAPIView ):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

class GetRoom( APIView ):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code'

    def get( self, request, format=None ):
        code = request.GET.get( self.lookup_url_kwarg )

        if ( code != None ):
            room = Room.objects.filter( code=code )

            if len( room ) > 0:
                data = RoomSerializer( room[0] ).data
                data['is_host'] = self.request.session.session_key == room[0].host
                return Response( data, status=status.HTTP_200_OK )
            
            return Response({'Room Not Found': 'Invalid Room Code.'}, status=status.HTTP_404_NOT_FOUND )
        
        return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST )

def createSessionIfNoneExists( self ):
    if not self.request.session.exists( self.request.session.session_key ):
            self.request.session.create()

class JoinRoom( APIView ):

    def post( self, request, format=None ):
        lookup_url_kwarg = 'code'

        createSessionIfNoneExists( self )

        code = request.data.get( lookup_url_kwarg )
        if code != None:
            room_result = Room.objects.filter( code=code )
            if len( room_result ) > 0:
                room = room_result[0]
                self.request.session[ 'room_code' ] = code
                return Response({'message': 'Room Joined!'}, status=status.HTTP_200_OK )
            
            return Response({'Bad Request': 'Invalid Room Code'}, status=status.HTTP_400_BAD_REQUEST )
            
        return Response({'Bad Request': 'Invalid post data, did not find a code key'}, status=status.HTTP_400_BAD_REQUEST )

class CreateRoomView( APIView ):
    serializer_class = CreateRoomSerializer

    def post( self, request, format=None ):
        createSessionIfNoneExists( self )

        serializer = self.serializer_class( data=request.data )

        if ( serializer.is_valid() ):
            guests_can_pause = serializer.data.get( 'guests_can_pause' )
            votes_to_skip = serializer.data.get( 'votes_to_skip' )
            host = self.request.session.session_key
            queryset = Room.objects.filter( host=host )

            if ( queryset.exists() ):
                room = queryset[0]
                room.guests_can_pause = guests_can_pause
                room.votes_to_skip = votes_to_skip
                room.save( update_fields=[ 'guests_can_pause', 'votes_to_skip' ] )
                self.request.session[ 'room_code' ] = room.code
            else:
                room = Room( host=host, guests_can_pause=guests_can_pause, votes_to_skip=votes_to_skip )
                room.save()
                self.request.session[ 'room_code' ] = room.code

            return Response( RoomSerializer( room ).data, status=status.HTTP_200_OK )
        
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST )

class UserInRoom( APIView ):
    def get( self, request, format=None ):
        createSessionIfNoneExists( self )

        roomCode = self.request.session.get( 'room_code' )

        roomCodeObject = {
            'code': roomCode
        }

        if ( roomCode == None ):
            return JsonResponse( RoomIDSerializer( roomCodeObject ).data, status=status.HTTP_404_NOT_FOUND )

        return JsonResponse( RoomIDSerializer( roomCodeObject ).data, status=status.HTTP_200_OK )

class LeaveRoom( APIView ):
    def post( self, request, format=None ):
        if 'room_code' in self.request.session:
            host_id = self.request.session.session_key
            self.request.session.pop( 'room_code' )

            room_results = Room.objects.filter( host=host_id )

            if len( room_results ) > 0:
                room = room_results[0]
                room.delete()

            return Response( {'Message': 'Success'}, status=status.HTTP_200_OK )
        
        return Response( {'Bad Request': 'Room code was not in the users session..'}, status=status.HTTP_400_BAD_REQUEST )

class UpdateRoom( APIView ):
    serializer_class = UpdateRoomSerializer

    def patch( self, request, format=None ):
        serializer = self.serializer_class( data=request.data )

        if serializer.is_valid():
            guests_can_pause = serializer.data.get( 'guests_can_pause' )
            votes_to_skip = serializer.data.get( 'votes_to_skip' )
            code = serializer.data.get( 'code' )

            queryset = Room.objects.filter( code=code )

            if not queryset.exists():
                return Response( {'msg': 'Room not found.'}, status=status.HTTP_404_NOT_FOUND )
            
            room = queryset[0]

            createSessionIfNoneExists( self )
            user_id = self.request.session.session_key

            if room.host != user_id:
                return Response( {'msg': 'You are not the host of this room.'}, status=status.HTTP_403_FORBIDDEN )
            
            room.guests_can_pause = guests_can_pause
            room.votes_to_skip = votes_to_skip
            room.save( update_fields=[ 'guests_can_pause', 'votes_to_skip' ] )
            return Response( RoomSerializer( room ).data, status=status.HTTP_200_OK )

        return Response( { 'Bad Request': 'Invalid Data...'}, status=status.HTTP_400_BAD_REQUEST )